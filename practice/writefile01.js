const { error } = require('console');
const fs =require('fs');

const data={
    name: 'David',
    age:28
};

fs.writeFile(
    'data.json',
    JSON.stringify(data,null,4),
error=>{
    if(error){
        console.log('無法寫入',error);
        process.exit;
    }
    console.log('寫入成功')
});