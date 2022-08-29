const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  // node: 'http://localhost:9200', //local
  node: "http://10.229.240.73:9200/", //remote
});

async function getProduct(index, match) {
    const prod = await client.search({
      index: index,
      query: {
        match: { name: match },
      },
    });
  
    return prod;
  }
  async function getpromotion (index, match){
  
      
    const result= await client.search({
        index: 'promotion',
        query: {
            match: { id: match }
          }
        })
    
        return result
    }

async function getAll(index){

    const count = await client.count({ index: index })
    const result= await client.search({
      index: index,
      // query: {
        //   match: { quote: 'inception' }
        // }
        size: count.count 
      })
      return result
}
async function updateProductByName(id, newValue){

  await client.update({
    index: "product",
    id: id,
    body: {
        doc: {
          ammountAvailable: newValue
        }
    }
}).then(
  function(resp) {
  },
  function(err) {
      console.log(err.message);
  }
);
}

async function insert(index, data) {
  try {
    await client.index({
      index: index,
      body: data
    })
    return data
  } catch (error) {
    return error
    
  }

}
module.exports = {getProduct, getpromotion, getAll, updateProductByName, insert}