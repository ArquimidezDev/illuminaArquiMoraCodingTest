# Arquimidez Mora ITJ Code Test Exercise

This repo has the metadata to support the following as part of the ITJ Coding Excersice:

### Use Case 1:

1.  Create a lwc (lightning web component) that takes zip code as an input and makes an api call. You can use the free zip code api (http://api.zippopotam.us/us/<zipcode>).
2.  If the country in response is *US*, response should be shown in another lightning component (No need to save data) but if the country value is anything else, response should be stored in a custom object.
3.  We should be able to see the non-US data in a different screen.
4.  Achieve the same using flow with proper exception handling. For this create a separate UI experience. 


### Use Case 2:

1.  Create a custom field called “Risk” with values as High, Low, Medium.
2.  When the value “High” is selected, trigger a platform event.
3.  Platform event should be subscribed, and case should be created. Case Owner should be a user different than account owner.