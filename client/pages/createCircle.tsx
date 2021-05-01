import React, { useState } from "react";
import { CustomError, useCreateCircleMutation } from "../generated/graphql";
import useAuth from "../hooks/useAuth";

interface createCircleProps {}

const createCircle: React.FC<createCircleProps> = ({}) => {
  const { user, userLoading } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [err, setErr] = useState<CustomError[]>([]);
  const [createCircle, { loading }] = useCreateCircleMutation();

  if (!user || userLoading) return <h3>Loading...</h3>;

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    setErr(null);
    const variables = { name, description };
    try {
      const { data, errors } = await createCircle({ variables });
      console.log(data);
      if (data.createCircle.errors) {
        setErr(data.createCircle.errors);
      } else {
        setErr([{ path: "succes", message: "circle created!" }]);
        setName("");
        setDescription("");
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };
  return (
    <div>
      <h1>New Circle</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          <input
            type="text"
            placeholder="Enter Circle Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            cols={30}
            rows={5}
            placeholder="description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          {err?.map((error) => (
            <h4 key={error.message}>{error.message}</h4>
          ))}
        </div>
        <button disabled={loading} type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

export default createCircle;
