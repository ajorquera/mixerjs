![Logo]
(https://raw.githubusercontent.com/ajorquera/mixerjs/develop/imgs/logo.png)

Web server that **serves multiple JavaScript libraries in a single http request.** 
During web development, a project will need the use of different kind of libraries. It can be 
frameworks, plugins or tracking scripts. Some websites load these dependencies one http request at a time, this means 
as dependencies grow it creates an overhead on the performance of the website. To handle this, there are some continuous
integration tools for unifying and minifying files. But, theses tools takes time and knowledge to make proper use of 
them. Hopefully MixerJS will provide a easy solution for it. 


The basic use will be:

- http://hostname/filename.js?libraryA&libraryB

- http://hostname/mixer.js?libraryA=versionA&libraryB


* ##Installation
    
    To run mixerJS, you will need to install nodejs. Go to [their website](https://nodejs.org) 
    for further instructions. Once installed, you can run the following command in the terminal:
    
    ```
    npm install
    node mixer.js
    ```

* ##How It Works
    Mixerjs uses [bower](http://bower.io/) for fetching the necessary libraries and does some underneath logic to handle 
    library dependency and errors. It uses different tools for minifying, concatenating and making custom builds.

* ##Configuration File
    MixerJs will have by default some basic configuration.
    
    **config.json**
    
    ```JSON
    {
        "env"    : "develop",
        "port"   : 8080,
        "builds" : [],
        "cache"  : false
    }
    ```
    
* ##Features
     
    + ####Minifying
     
     Minifying the libraries can be optional. Adding .min.js to the end of the filename will minify it 
     automatically.
     
    + ####Custom builds (TODO)
     
     Some libraries allows to create custom builds in order to just take what you need. MixerJS can accept a json 
     structure through the query for that specific library. More information in 
     [builds](https://github.com/ajorquera/mixerjs/builds)   
        
    + ####Cache and nginx
     
     For better use of MixerJS, we can take advantage of nginx cache. Nginx cache is very fast, with either memcache 
     or disk storage. The first attempt to retrieve the file will go through nginx and it will be proxied to mixerJS. 
     Subsequent attempts will be serve by nginx's cache. 
     
    + ####Library Fallback
          
      Some libraries doesn't follow the correct pattern when setting up their bower.json, as a consequence mixerjs has 
      problems to find the corresponding library file. `libraryFallback.json` is a json file that solves this issue, 
      setting the correct path for each library. 
      
      ```JSON
      {
          "jquery-easing-original": {
              "default": {
                  "path":"jquery.easing.js"
              },
              
              "1.3.2": {
                  "path":"jquery.easing.js"
              }
          }
      }
      ```
     
* ##Testing
     
     MixerJS have some test you can run by using [mocha](http://mochajs.org/). To run the tests, go to the terminal 
     and do:
     
     `mocha tests`
     
* ##Demo
     We have set up a small server using the domain name `jort.ch`, so you can check it online. Some uses are:
     
    **JS**
    
     + http://jort.ch/mixer.js?jquery
     + http://jort.ch/mixer.min.js?lodash=2.4.1&jquery
     + http://jort.ch/compile.js?bootstrap&foundation&angular&angular-ui-router
     + http://jort.ch/compile.min.js?react=0.14.0&jquery-easing-original