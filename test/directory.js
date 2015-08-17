var fs = require('fs');

exports.testSomething = function(test){
    fs.open('../dist/feeds/directory.json','r',function(err, fileToRead){
        test.expect(1);
        test.ok(true, "this assertion should pass");
        test.done();
    });
};

exports.testSomethingElse = function(test){
    test.ok(false, "this assertion should fail");
    test.done();
};
