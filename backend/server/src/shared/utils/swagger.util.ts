export const setDescriptionDocumentBuilder = (): string => {
  return `
### Must read
  - \`x-client-id\` is used in conjunction with \`Authorization\` to perform authentication

  - For operations that **do not require** \`x-client-id\` in the header, the client ID **does not affect** the result.

  - For operations that **may or may not have** a \`x-client-id\`, the client ID **can affect** the result.

  - If you have provided \`client-id\` in the **Authorize** section, the **client-id (apiKey)** section, then this \`client-id\` will be used for the entire API,
  and is assigned to the header as \`x-client-id\`, you can override \`x-client-id\` in the header of each route

  - If you do not provide a \`client-id\` the system will default you to a guest (A user without an account)

### Notes:
  - **x-client-id** is optional for some endpoints.

  - The presence of **client-id** may alter the response in some cases (Like verify you are an admin, you can get more info of manga, categories...).

### Error Handling in Development
  - If the environment is **\`development\`**, you can see more details of error.
`;
};
