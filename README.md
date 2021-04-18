# lou info

The GOOD
- amazing graph inspector (AWS->Step Functions->StateMachines)
- offers change config management to services
- Statefunctions: Offers variable mapping incoming and outgoing (? troubles ?)

The Bad
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

AWS -> Step Functions -> State Machines -> [machine] -> [exectution]
AWS -> Cloud Watch -> Lambda
AAWS -> Lambda -> Functions

## optionally delete existing records
aws dynamodb scan --table-name "$tn" --max-items 1000 | tee moo.records   
lv-sam-app-step-test2 % cat moo.records | jq -r '.Items[].Id.S' \
    | xargs -I keyItem aws dynamodb delete-item --table-name "$tn" --key='{"Id":{"S":"keyItem"}}'

## run

aws stepfunctions start-execution --state-machine-arn $sf
seq 10 | xargs -I moo aws stepfunctions start-execution --state-machine-arn $sf

aws dynamodb scan --table-name $tn \
    | jq -r '.Items|.[]|(.Timestamp.S+"\t"+.Quality.N+"\t"+.Type.S)'
2021-04-18T19:50:22.171Z        21      archive
2021-04-18T19:50:24.908Z        64      fail
2021-04-18T19:50:27.578Z        55      fail
2021-04-18T19:50:26.174Z        97      fail
2021-04-18T19:47:32.109Z        49      archive

see (CloudWatch -> Logs -> Log groups) for events on statefunctions, lambdas, ?

# troubleshooting

## in ROLLBACK_COMPLETE state and can not be updated
Error: Failed to create changeset for the stack: ncap-lv-step-test-sam, An error occurred (ValidationError) when calling the CreateChangeSet operation: Stack:arn:aws:cloudformation:us-east-2:633311497993:stack/ncap-lv-step-test-sam/b19114c0-a082-11eb-92ad-020cb91688de is in ROLLBACK_COMPLETE state and can not be updated.

sn=`cat samconfig.toml | grep stack_name | sed 's/.*= //' | tr -d '"'`
echo $sn
aws cloudformation delete-stack --stack-name $sn
