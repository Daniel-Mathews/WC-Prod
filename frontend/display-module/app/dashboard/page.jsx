"use client";

import useAuth from "./{components}/useAuth";
import Loading from "./{components}/loading";
/*
const Page = () => {
    const isAuthenticated = useAuth(); // Get the authentication state from the hook
    //Authenticate the page
    if(!isAuthenticated) {
        //Loading animation
        return <Loading /> ; // Show a loading indicator while verifying
    }
    //If authenticated return protected content
    else {

        return (
            <div>
                <h1>Content</h1>
            </div>
        );
    }
}
*/

const Page = () => {
        return (
            <div>
                <h1>Content</h1>
            </div>
        );
}
export default Page;
