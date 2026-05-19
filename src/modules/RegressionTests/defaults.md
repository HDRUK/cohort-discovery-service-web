## All Ages

```
{"id":"4cd60655-3d71-43d6-8a95-7fbe52175ee7","rules":[{"id":"9ade2a36-f047-40f9-a37c-3d6464d6ab2d","value":[0,120],"valid":true}],"valid":true}
```

## Over 56

```
{"id":"4cd60655-3d71-43d6-8a95-7fbe52175ee7","rules":[{"id":"9ade2a36-f047-40f9-a37c-3d6464d6ab2d","value":[56,120],"valid":true}],"valid":true}
```


## Male or Female


```
{"id":"4cd60655-3d71-43d6-8a95-7fbe52175ee7","rules":[{"id":"d36489b1-acbb-4dac-bc61-fe1563f8ff4c","exclude":false,"rule":{"concept":{"concept_id":8532,"name":"FEMALE","category":"Gender","match_score":1000,"ncollections":2,"count":"184512860","children":[]}},"valid":true},{"id":"92cf0721-6986-4292-b9f2-4c61a758c411","combinator":"or","valid":true},{"id":"8250b2e0-df54-4e84-958e-c12aa14a0ee3","exclude":false,"rule":{"concept":{"concept_id":8507,"name":"MALE","category":"Gender","match_score":1000,"ncollections":2,"count":"170387140","children":[]}},"valid":true}],"valid":true}
```



## Males over 50 with astma or Females over 55 with astma
```
{"id":"e3f955bf-6ce1-4f06-9bb1-7142d1a1d366","rules":[{"id":"7875123d-9154-483d-8b95-93038bd200bf","exclude":false,"rules":[{"id":"210eaf72-8391-46d1-88c6-9f90004b44b8","value":[50,120],"valid":true},{"id":"aed36b03-e779-4b31-95f5-5af96f11e0c9","combinator":"and","valid":true},{"id":"557197e2-5201-4682-9a98-65618cb988be","exclude":false,"rule":{"concept":{"concept_id":8532,"name":"FEMALE","category":"Gender","match_score":1000,"ncollections":2,"count":"184512860","children":[]}},"valid":true},{"id":"7e548f55-4f18-45fd-91d1-ebd48a3f3de4","combinator":"and","valid":true},{"id":"4501a717-e58e-4a65-8ea0-0239038c986a","exclude":false,"rule":{"concept":{"concept_id":317009,"name":"Asthma","category":"Condition","match_score":1000,"ncollections":2,"count":"265650","children":[]}},"valid":true}],"valid":true},{"id":"642a2473-4d3a-4f83-843c-5c19cf11378b","combinator":"or","valid":true},{"id":"21c5110c-4e23-42df-ae23-42ba219564a7","rules":[{"id":"d7c3e1a8-ee11-4d94-886a-e865b1635fd8","value":[55,120],"valid":true},{"id":"004b2a67-8975-4149-8ae6-c5871582a561","combinator":"and","valid":true},{"id":"77eb4592-cb7e-43da-b59b-129a90d624f8","exclude":false,"rule":{"concept":{"concept_id":8507,"name":"MALE","description":"MALE","category":"Gender","children":[],"ncollections":3,"all_synthetic":0,"match_score":111.64791843300216,"tokens":["male"],"phrase_tokens":[],"alternatives":[]}},"valid":true},{"id":"6244b0ac-9bd4-4286-9454-f90c90b26739","combinator":"and","exclude":false,"valid":true},{"id":"e00dc8fa-c314-48c4-b595-b80505e813d2","exclude":false,"rule":{"concept":{"concept_id":317009,"name":"Asthma","description":"Asthma","category":"Condition","children":[],"ncollections":2,"all_synthetic":0,"match_score":111.03972077083992,"tokens":["asthma"],"phrase_tokens":[],"alternatives":[]}},"valid":true}],"valid":true}],"constraints":{"ageConstraint":[null,null],"timeConstraint":[null,null]},"warnings":["Age over 50 intepreted as current age > 50"],"valid":true}
```

## People with covid who received either the moderna of pfizer vaccine
```
{"id":"6f6b6461-4434-403c-8038-4ab8d48618ad","rules":[{"id":"4343ce5d-0aa8-457a-8411-3e935f808099","exclude":false,"rule":{"concept":{"concept_id":37311061,"name":"COVID-19","category":"Condition","children":[],"match_score":99.7,"tokens":["19","covid"],"phrase_tokens":["covid 19"],"alternatives":[]}},"valid":true},{"id":"6997b36e-f743-4b11-b3b4-4aaf70235c33","combinator":"and","exclude":false,"valid":true},{"id":"4f191ef6-9123-443b-8cb2-d28af8a9dfd3","rules":[{"id":"9dd349ba-a14c-4673-815a-87936f296145","exclude":false,"rule":{"concept":{"concept_id":37003518,"name":"SARS-CoV-2 (COVID-19) vaccine, mRNA-1273 0.2 MG/ML Injectable Suspension","category":"Drug","children":[]}},"valid":true},{"id":"2ca9902c-4538-49ce-915f-caee496ed330","combinator":"or","valid":true},{"id":"07e7f8bf-a357-4914-8dd8-f1a2b383fce0","exclude":false,"rule":{"concept":{"concept_id":37003436,"name":"SARS-CoV-2 (COVID-19) vaccine, mRNA-BNT162b2 0.1 MG/ML Injectable Suspension","category":"Drug","children":[]}},"valid":true}],"valid":true}],"constraints":{"ageConstraint":[null,null],"timeConstraint":[null,null]},"warnings":[],"valid":true}
```

## Adults with diabetes and receiving Insulin 
```
{"id":"32f036e6-4a6c-4f33-b998-db011f07563f","rules":[{"id":"b843e0a3-494e-487e-b41b-9713c9497e54","value":[18,120],"valid":true},{"id":"487cb1d7-7673-4aa6-968a-9b313067dd01","combinator":"and","valid":true},{"id":"d852d24b-de59-46b6-a66c-de9e4a532d50","exclude":false,"rule":{"concept":{"concept_id":201826,"name":"Type 2 diabetes mellitus","category":"Condition","children":[]}},"valid":true},{"id":"09cd14b2-96aa-40e3-b2a4-d4d815f0f650","combinator":"and","exclude":false,"valid":true},{"id":"2e542e7c-385a-4192-a93a-d596f94b0d7c","rules":[{"id":"2f2256c6-184e-458a-a033-010be05906b1","rule":{"concept":{"name":"3 ML Insulin Glargine 100 UNT/ML Injectable Suspension","count":"109505","category":"Drug","children":[],"concept_id":44191029}},"exclude":false,"valid":true},{"id":"2cb286d0-cf73-4bb4-afe8-f12ab40a1638","combinator":"or","valid":true},{"id":"b799412b-d60f-4ae5-91ff-f03a797acc5c","rule":{"concept":{"name":"3 ML insulin detemir 100 UNT/ML Prefilled Syringe","count":"124634","category":"Drug","children":[],"concept_id":21136739}},"exclude":false,"ageConstraintOperator":"gt","timeConstraintOperator":"gt","valid":true}],"valid":true}],"constraints":{"ageConstraint":[null,null],"timeConstraint":[null,null]},"valid":true}
```