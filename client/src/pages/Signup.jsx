import { useForm } from "react-hook-form";

const Signup = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submittedData = (data) => {
    console.log(data)
  }
  return (
    <div>
      <form onSubmit={handleSubmit(submittedData)}>
        <input {...register("firstName")} placeholder="Enter name" />
        <input {...register("email")} placeholder="Enter email" />
        <input {...register("password")} placeholder="Enter password" />

        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
  );
};

export default Signup;

// import { useState } from "react";

// const Signup = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(name,email,password)
//   };
//   return (
//     <form onSubmit={handleSubmit} className=" min-h-screen gap-y-4 flex flex-col justify-center items-center">
//       <input
//         type="text"
//         value={name}
//         placeholder="Enter your first name"
//         onChange={(e) => setName(e.target.value)}
//       />
//       <input
//         type="email"
//         value={email}
//         placeholder="Enter your Email"
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         value={password}
//         placeholder="Enter your Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />
//        <button type="submit">Signup</button>
//     </form>
//   );
// };

// export default Signup;
