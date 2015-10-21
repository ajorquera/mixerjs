#Custom Builds TODO

Some framworks or libraries have the ability to create custom builds. In mixerJS you can pass a json structure in the 
GET request and create a build for that specific library. For the builds to work, we need to inyect a specific module
in the config,js file. By default, we have lodash and jquery available. 

**config.js**
```
{
    //...
    
    builds: [lodash,. jquery]
    
    //...
}
```

To create a new library build, create a file from *buildTemplate.js* with a filename in the format `lodashBuild`. In the file do a function 
that will handle the build. 
This function will have as argument the json object that was passed in the query and it should return the custom build
as a string buffer

**lodashBuild.js**
```javascript
export.lodashBuild = function(config) {
    
    //code...
    
    return stringBuffer;
}
```

##Demo TODO

To test the custom build for lodash we need to check the json structure that we need to send(Open lodashBuild.js). 
For lodash it should be something like:

```
{
    "category" : "array",
    "plus"     : ["random", "template"]
}
```

Once is url encoded it should look something like:

+ jort.ch/compile.js?lodash=%7B%22category%22%3A%22array%22%2C%22plus%22%3A%5B%22random%22%2C%22template%22%5D%7D