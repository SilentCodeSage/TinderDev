const userAuth = (req,res,next) =>{
    console.log("User Authentication Checking !!!");
    const password = "XYZ";
    const isUserLoggedIn = password === "XYZ";

    if(isUserLoggedIn){
        next()
    }else{
        res.status(400); 
    }
}

module.exports = {
    userAuth,
} 