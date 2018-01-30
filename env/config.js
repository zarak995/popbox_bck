var config = {
    development: {
        //Development database url
        dburl: 'mongodb://localhost/suggestionBoxDB',
        secret: 'kjsdhfjskdhfjskhfuefhksdjfhksdjfkjsdhfjskdhfjskhfue2122232425262728292010fhks2122232425262728292010djfh2122232425262728292010k2122232425262728292010sdjf',
        //server details
        server: {
            host: '127.0.0.1',
            port: '3000'
        },
        
        aws_topic_sms: 'Topic sms',
        aws_verification_code_message_body: 'Thank you for registering with oOxet.com this is your Verification code 56789867',
        aws_accessKeyId: 'AKIAIOIGEBKPZGPS7TGQ',
        aws_secretAccessKey: 'kRLApWaOh6loKHcUdtxvTrmA6drpw6IBxa2XOtsJ',
        aws_region: 'us-east-1',
    },
    production: {
        dburl: 'mongodb://zarak995:ZaraKhumba23@cluster0-shard-00-00-wxeue.mongodb.net:27017,cluster0-shard-00-01-wxeue.mongodb.net:27017,cluster0-shard-00-02-wxeue.mongodb.net:27017/suggestionBoxDB?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',
        server: {
            host: 'http://52.55.249.148',
            port: '3000'
        },
        aws_topic_sms: 'Topic sms',
        aws_verification_code_message_body: 'Thank you for registering with oOxet.com this is your Verification code 56789867',
        aws_accessKeyId: 'AKIAIOIGEBKPZGPS7TGQ',
        aws_secretAccessKey: 'kRLApWaOh6loKHcUdtxvTrmA6drpw6IBxa2XOtsJ',
        aws_region: 'us-east-1',
        secret: '123Secret?456?anothersecret??**how_Have_=_uBeen_BoBBo..<<kjsdh5262728292010k21sdfsdf2s22324252627sdfsdfsdf28292010sdjf>>:""QWE nm.,nmdgdfgdfgd'

    }
};
module.exports = config;
