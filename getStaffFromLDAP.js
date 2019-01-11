var LdapClient = require('promised-ldap');
var client = new LdapClient({url: 'ldap://ldap.virginia.edu'});
var base = "ou=People,o=University of Virginia,c=US";

var getem = async function (){
  var staff = await client.search(base, {filter:"ou=E0:LB-Univ Librarian-General*", scope:'sub'});
  staff.entries.forEach(e=>console.log(e.object));
}

getem().then(function(){process.exit()});
