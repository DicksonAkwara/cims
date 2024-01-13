from rest_framework import serializers
from .validators import validate_possible_number

from .utils import MpesaGateWay
from .models import MpesaResponseBody, Transaction

pay = MpesaGateWay()

class SendSTKPushSerializer(serializers.Serializer):
    phonenumber = serializers.CharField()
    amount = serializers.CharField()

    def validate_amount(self, attrs):
        amount = int(attrs)

        if amount <= 0:
            raise serializers.ValidationError(detail="Amount must be greater than 0")
        return amount

    def validate_phonenumber(self, attrs):
        phonenumber = attrs

        try:
            validate_possible_number(phonenumber, "KE")
            return phonenumber
        except:
            raise serializers.ValidationError(detail="Invalid Phone Number")
        

    def create(self, validated_data):
        phonenumber = validated_data['phonenumber']
        amount = validated_data['amount']

        if str(phonenumber)[0] == "+":
            phonenumber = phonenumber[1:]
        elif str(phonenumber)[0] == "0":
            phonenumber = "254" + phonenumber[1:]

        callback_url = 'https://greencode.co.ke/stkphp/callback.php' # enter the callback url 
        payment = pay.stk_push(phonenumber=phonenumber, amount=amount, callback_url=callback_url)

        res = payment.json()

        return res
    

class MpesaResponseBodySerializer(serializers.ModelSerializer):
    class Meta:
        model = MpesaResponseBody
        fields = "__all__"

        
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"
                

"""
sample request
import requests

​

headers = {

  'Content-Type': 'application/json',

  'Authorization': 'Bearer hComEBZIznNzhOX2ECauLlIFSuoV'

}

​

payload = {

    "BusinessShortCode": 174379,

    "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjMxMDI3MTg1ODAy",

    "Timestamp": "20231027185802",

    "TransactionType": "CustomerPayBillOnline",

    "Amount": 1,

    "PartyA": 254798693754,

    "PartyB": 174379,

    "PhoneNumber": 254798693754,

    "CallBackURL": "https://mydomain.com/path",

    "AccountReference": "CompanyXLTD",

    "TransactionDesc": "Payment of X" 

  }

​

response = requests.request("POST", 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', headers = headers, data = payload)

print(response.text.encode('utf8'))

  sample response

  {

  "MerchantRequestID": "15777-50917843-1",

  "CheckoutRequestID": "ws_CO_27102023190055907798693754",

  "ResponseCode": "0",

  "ResponseDescription": "Success. Request accepted for processing",

  "CustomerMessage": "Success. Request accepted for processing"

}

//sample callback response

{
"Body": 
{
    "stkCallback": 
    {
        "MerchantRequestID": "21605-295434-4",
        "CheckoutRequestID": "ws_CO_04112017184930742",
        "ResultCode": 0,
        "ResultDesc": "The service request is processed successfully.",
        "CallbackMetadata": 
        {
            "Item": 
            [
                {
                    "Name": "Amount",
                    "Value": 1
                },
                {
                    "Name": "MpesaReceiptNumber",
                    "Value": "LK451H35OP"
                },
                {
                    "Name": "Balance"
                },
                {
                    "Name": "TransactionDate",
                    "Value": 20171104184944
                },
                {
                    "Name": "PhoneNumber",
                    "Value": 254706506361
                }
            ]
        }
    }
}
}




"""