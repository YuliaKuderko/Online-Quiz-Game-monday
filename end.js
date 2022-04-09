const username = document.querySelector('#username')
const saveScoreBtn = document.querySelector('#saveScoreBtn')
const finalScore = document.querySelector('#finalscore')
const mostRecentScore = localStorage.getItem('mostRecentScore')


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
    e.preventDefault() 

    //gets the score's sum 
    const score = {
        score: mostRecentScore,
        name: username.value
    }

    highScores.push(score)

    //sorting the scores in a descending order 
    highScores.sort((a, b) => {
        return b.score - a.score 
    })

    highScores.splice(10)

    localStorage.setItem('highScores', JSON.stringify(highScores))
    window.location.assign('/highScores.html')
}