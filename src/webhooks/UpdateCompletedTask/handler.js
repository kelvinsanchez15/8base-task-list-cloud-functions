import gql from "graphql-tag";

const UPDATE_TASK_COMPLETED_MUTATION = gql`
  mutation TaskUpdate($id: ID!, $completed: Boolean) {
    taskUpdate(filter: { id: $id }, data: { completed: $completed }) {
      id
    }
  }
`;

const responseBuilder = (code = 200, message = undefined, headers = {}) => ({
  body: JSON.stringify({ message }),
  statusCode: code,
  headers,
});

module.exports = async (event, ctx) => {
  const { completed } = JSON.parse(event.body);
  const { id } = event.pathParameters;

  try {
    await ctx.api.gqlRequest(
      UPDATE_TASK_COMPLETED_MUTATION,
      {
        id,
        completed,
      },
      { checkPermissions: false }
    );
    /* Handle errors for failed GraphQL mutation */
  } catch (e) {
    return responseBuilder(422, "Failed to update task");
  }
};
