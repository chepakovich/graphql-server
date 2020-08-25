var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var cors = require('cors');
var sourceData = require('./sourceData.json')

var schema = buildSchema(`
  type Query {
    calculateCost(commodity: String, price: Int, tons: Int): [Out]
  }
  type Out {
    COUNTRY: String
    TOTAL_COST: Float
    FIXED_COST: Float
    VARIABLE_COST: Float
  }
`);

var root = {
  calculateCost: ({ commodity, price, tons }) => {
    var out = [];
    for (var item of sourceData) {
      if (item["COMMODITY"] === commodity) {
        out.push(
          {
            COUNTRY: item["COUNTRY"],
            TOTAL_COST: ((item["FIXED_OVERHEAD"] + item["VARIABLE_COST"] + price) * tons).toFixed(2),
            FIXED_COST: item["FIXED_OVERHEAD"].toFixed(2),
            VARIABLE_COST: (item["VARIABLE_COST"] + price).toFixed(2)
          }
        );
      }
    }
    return out;
  },
};

var app = express();
app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
