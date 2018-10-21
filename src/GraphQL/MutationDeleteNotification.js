import gql from "graphql-tag";

export default gql(`
mutation($id: ID!){
  deltNotification(id: $id){
    id
    title
    startDate
    endDate
    content
  }
}
`);
