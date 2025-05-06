import React from "react";

export default function Login() {
  return (
    <div>
      <p>Logic Page </p>
      <form>
      </form>
        <input type="text" name="username" id="usname" placeholder="username"/>
        <label htmlFor="usname">Username</label> 
        <input type="password" name="password" id="pswrd" placeholder="password"/>
        <label htmlFor="pswrd">Password</label> 
        <input type="email" name="email" id="eml" placeholder="Email"/>
        <label htmlFor="eml">Email</label> 
        <input type="phone" name="phone" id="phn" placeholder="Phone"/>
        <label htmlFor="phn">Phone</label> 
    </div>
  );
}
