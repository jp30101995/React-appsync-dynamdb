import gql from "graphql-tag";

export default gql(`
query($id: ID!){
  getNotifications(id: $id){
		title
    id
    startDate
    endDate
    content
  }
}
`);
