import { useState } from "react";
import "./App.css";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      age
      name
      isMarried
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      age
      name
      isMarried
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      name
    }
  }
`;

function App() {
  const [newUser, setNewUser] = useState({});

  const {
    data: getUsersData,
    error: getUsersError,
    loading: getUsersLoading,
  } = useQuery(GET_USERS);
  const {
    data: getUsersByIdData,
    loading: getUsersByIdLoading,
  } = useQuery(GET_USER_BY_ID, {
    variables: { id: "2" },
  });

  const[createUser] = useMutation(CREATE_USER)

  if (getUsersLoading) return <p>Loading...</p>;

  if (getUsersError) return <p>{getUsersError.message}</p>;

  const handleCreateUser = async () => {    
    createUser({ variables: {name: newUser.name, age: Number(newUser.age), isMarried: false}})
  }

  return (
    <>
      <div>
        <input placeholder="Name..." onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))} />
        <input placeholder="Age..." type="number" onChange={(e) => setNewUser((prev) => ({ ...prev, age: e.target.value }))}/>
        <button onClick={handleCreateUser}>Create User</button>
      </div>
      <h1>User</h1>
      <div>
        {getUsersByIdLoading ? (
          <p>Loading user...</p>
        ) : (
          <>
            <h1>Chosen User: </h1>
            <p>{getUsersByIdData.getUserById.name}</p>
            <p>{getUsersByIdData.getUserById.age}</p>
          </>
        )}
      </div>

      <div>
        {getUsersData.getUsers.map((user) => (
          <div key={user.id}>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
            <p>Married: {user.isMarried ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
