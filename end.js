const username = document.querySelector('#username')
const saveScoreBtn = document.querySelector('#saveScoreBtn')
const finalScore = document.querySelector('#finalscore')
const mostRecentScore = localStorage.getItem('mostRecentScore')

//retrieve data from local storage 
const highScores = JSON.parse(localStorage.getItem('highScores')) || []

const MAX_HIGH_SCORES = 10

finalScore.innerText = mostRecentScore

//if there's no username input, make the save button disabled, else the button will be enabled
username.addEventListener('keyup', () => {
    saveScoreBtn.setAttribute('disabled','disabled')
    if (username.value != "") {
        saveScoreBtn.removeAttribute('disabled')
    }
})


saveHighScore = e => {
    //prevents an automatic refresh
    e.preventDefault() 

    //stores the score's value and the username that was inserted
    const score = {
        score: mostRecentScore,
        name: username.value
    }

    // push the score to the highscore array
    highScores.push(score)

    //sorting the scores in a descending order 
    highScores.sort((a, b) => {
        return b.score - a.score 
    })

    // limits the highscore table into 10 "lines" and ands new scores into the array
    highScores.splice(MAX_HIGH_SCORES)

    // stringify converts the highscores array into a JSON string (creates JSON string from JS string)
    //storing data in local storage 
    localStorage.setItem('highScores', JSON.stringify(highScores))
    window.location.assign('/highScores.html')
}