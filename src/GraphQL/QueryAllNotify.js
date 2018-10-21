import gql from "graphql-tag";

export default gql(`
query {
  listNotifications(limit: 1000){
    items{
      id
      title
      content
      startDate
      endDate
    }
  }
}
`);
