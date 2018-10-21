import gql from "graphql-tag";

export default gql(`
mutation($title: String!, $content: String, $startDate: Int, $endDate: Int){
  createNotification(title: $title, content: $content, startDate: $startDate, endDate: $endDate){
    id
    title
    content
    startDate
    endDate
  }
}
`);
