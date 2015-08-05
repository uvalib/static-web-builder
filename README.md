# static-web-builder
This project builds static versions of web sites and feeds from dynamic sources.

## to install dependencies 
```
npm install
```

## to build static staff directory (in JSON format)
Set ENV variables for MYGROUP_USER and MYGROUP_PASSWORD for your account that is able to bind to the mygroup LDAP server.
```
npm run staff-listing
```

## to build static version of the Library web site
```
npm run library-site
``` 
