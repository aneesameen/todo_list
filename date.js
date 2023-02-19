

function getdate (){
    const day = new Date();
    const options ={
        weekday : "long"
    }

    const currentDay = day.toLocaleDateString("en-US", options);
    return currentDay;
}

module.exports = getdate;