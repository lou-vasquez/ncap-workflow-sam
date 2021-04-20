# lou info

key points
- most info less about SAM, more about step functions or cloudformation
- SAM is mostly just cloudformation + step functions + lambdas...

The GOOD
- amazing graph inspector (AWS->Step Functions->StateMachines)
- offers change config management to services
- Statefunctions: Offers variable mapping incoming and outgoing (? troubles ?)

The Bad
- stack config errors often appear in deploy (not verification)
- slow deploy (maybe use localstack or "step functions local")
- not sure how to test StateMachine operators (localstack? lambdas testable in js/python/...)
- changes table name every deploy? (may be me)
- changes stack name every deploy? (may be me)

The Meh
- really cloudformation under hood
- example uses AWS Serverless vs direct State Machine

TODO
- Express workflows?

refs
- SAM: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
- Step Functions: States: https://docs.aws.amazon.com/step-functions/latest/dg/concepts-states.html
- Step Functions: https://aws-step-functions-data-science-sdk.readthedocs.io/en/stable/steps.html
- Manipulate message en-route: https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html

# using

sam build
sam deploy --guided

tn=`aws dynamodb list-tables | jq -r '.TableNames|.[]|select(match(".*ArchiveTable.*"))'`
sf=`aws stepfunctions list-state-machines | jq -r '.stateMachines|.[]|select(.stateMachineArn|match(".*ArchiverStateMachine.*"))|.stateMachineArn'`
echo $tn
echo $sf

aws dynamodb scan --table-name $tn
aws stepfunctions start-execution --state-machine-arn $sf

## cool ui

debugging stepfunctions and lambdas in AWS console is amazing

AWS -> Step Functions -> State Machines -> [machine] -> [exectution]
AWS -> Cloud Watch -> Lambda
AWS -> Lambda -> Functions -> [function] -> Monitor

## optionally delete existing records
```
aws dynamodb scan --table-name "$tn" --max-items 1000 | tee moo.records   
cat moo.records | jq -r '.Items[].Id.S' \
    | xargs -I keyItem aws dynamodb delete-item --table-name "$tn" --key='{"Id":{"S":"keyItem"}}'
```
## run
```
aws stepfunctions start-execution --state-machine-arn $sf
seq 10 | xargs -I moo aws stepfunctions start-execution --state-machine-arn $sf
```
```
aws dynamodb scan --table-name $tn \
    | jq -r '.Items|.[]|(.Timestamp.S+"\t"+(.Archive.BOOL|tostring)+"\t"+.Quality.N+"\t"+.Action.S)'
2021-04-20T06:16:14.455Z        true    4       Quality_Fail
2021-04-20T06:16:19.193842      false   56      Unarchivable
2021-04-20T06:15:52.132594      false   9       Unarchivable
2021-04-20T06:16:17.852Z        true    96      Archived
2021-04-20T06:16:14.906734      false   60      Unarchivable

```
see (CloudWatch -> Logs -> Log groups) for events on statefunctions, lambdas, ?

# troubleshooting

## in ROLLBACK_COMPLETE state and can not be updated
```Error: Failed to create changeset for the stack: ncap-lv-step-test-sam, An error occurred (ValidationError) when calling the CreateChangeSet operation: Stack:arn:aws:cloudformation:us-east-2:633311497993:stack/ncap-lv-step-test-sam/b19114c0-a082-11eb-92ad-020cb91688de is in ROLLBACK_COMPLETE state and can not be updated.```

```
sn=`cat samconfig.toml | grep stack_name | sed 's/.*= //' | tr -d '"'`
echo $sn
aws cloudformation delete-stack --stack-name $sn
```
