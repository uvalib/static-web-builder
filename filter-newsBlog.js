var request = require('request-promise'),
    items = require('./newsBlog.json'),
    moment = require('moment');

console.log(
  JSON.stringify(
    items.posts.map(
      p=>{return {
        id:p.id,
        slug:p.slug,
        link:p.url,
        title:p.title,
        body:p.content,
        excerpt:p.excerpt,
        created:moment(p.date,"YYYY-MM-DD HH:mm:ss").unix(),
        categories:p.categories.map(c=>{return {id:c.slug, title:c.title}}),
        tags:p.tags.map(t=>{return {id:p.slug, title:p.title}})
      };}
    )
  )
);
