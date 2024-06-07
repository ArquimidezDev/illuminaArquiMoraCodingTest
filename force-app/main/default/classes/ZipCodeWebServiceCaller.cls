/**
 * @description       : Class to call Zip Code validation web service
 * @author            : Arquimidez Mora
 * @group             : 
 * @last modified on  : 06-06-2024
 * @last modified by  : Arquimidez Mora
**/
public with sharing class ZipCodeWebServiceCaller {

    /**
    * @description Calls Zip Code validation web service
    * @author Arquimidez Mora | 06-06-2024 
    * @param String strCountry
    * @param String strZipCode
    * @return string - Json response
    **/
    @AuraEnabled(cacheable=true)
    public static String zipCodeValidation(String strCountry, String strZipCode){
        ResponseWrapper objResponse = new ResponseWrapper();
        try {
            HttpRequest objRequest = new HttpRequest();
            objRequest.setEndpoint('http://api.zippopotam.us/'+strCountry+'/'+strZipCode);
            objRequest.setMethod('GET');

            Http http = new Http();
            HTTPResponse objHTTPResponse = http.send(objRequest);
            if(objResponse != null) {
                Integer intStatusCode = objHTTPResponse.getStatusCode();
                if(intStatusCode >= 300){
                    objResponse.strStatus = 'error';
                    if(intStatusCode == 404){
                        objResponse.strMsg = 'Invalid Zip Code ' + strZipCode + ' for selected country: ' + strCountry;
                    }else{
                        objResponse.strMsg = 'Failed to call external service, status: ' + intStatusCode;
                    }
                }else{
                    objResponse.strStatus = 'ok';
                    objResponse.strMsg = objHTTPResponse.getBody();
                }
            }else{
                objResponse.strStatus = 'error';
                objResponse.strMsg = 'Failed to call external service';
            }
        } catch (Exception e) {
            System.debug('Error: ' + e.getMessage() + ', line: ' + e.getLineNumber());
            objResponse.strStatus = 'error';
            objResponse.strMsg = 'There was an error procesing the request, please reach out to tech support';
        }
        System.debug('*** objResponse: ' + objResponse);
        return JSON.serialize(objResponse);
    }

    public class ResponseWrapper{
        String strStatus;
        String strMsg;
    }
}