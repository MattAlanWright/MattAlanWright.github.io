function makeKey(key, chords) {
    return {
        key: key,
        chords: {
            ii: chords[0],
            V: chords[1],
            I: chords[2],
        },
    };
}

function makeChord(name, notes) {
    const chord = {
        name: name,
        i: notes[0],
        iii: notes[1],
        v: notes[2],
        vii: notes[3],
    };

    return chord;
}

const chords = {
    // C
    Dm7: makeChord("Dm7", ["D", "F", "A", "C"]),
    G7: makeChord("G7", ["G", "B", "D", "F"]),
    Cmaj7: makeChord("Cmaj7", ["C", "E", "G", "B"]),

    // F
    Gm7: makeChord("Gm7", ["G", "Bb", "D", "F"]),
    C7: makeChord("C7", ["C", "E", "G", "Bb"]),
    Fmaj7: makeChord("Fmaj7", ["F", "A", "C", "E"]),

    // Bb
    Cm7: makeChord("Cm7", ["C", "Eb", "G", "Bb"]),
    F7: makeChord("F7", ["F", "A", "C", "Eb"]),
    Bbmaj7: makeChord("Bbmaj7", ["Bb", "D", "F", "A"]),
};

const keys = [
    makeKey("C", [chords.Dm7, chords.G7, chords.Cmaj7]),
    makeKey("F", [chords.Gm7, chords.C7, chords.Fmaj7]),
    makeKey("Bb", [chords.Cm7, chords.F7, chords.Bbmaj7]),
];

let currentQuestionIndex = 0;

function makeV7QuestionAndAnswer(key) {
    return {
        question: `V7 of ${key.key}`,
        answer: key.chords.V.name,
    };
}

function makeTwoQuestionAndAnswer(key) {
    return {
        question: `ii of ${key.key}`,
        answer: key.chords.ii.name,
    };
}

function makeTwoFiveOneQuestionAndAnswer(key) {
    return {
        question: `ii V I in ${key.key}`,
        answer: `${key.chords.ii.name} - ${key.chords.V.name} - ${key.chords.I.name}`,
    };
}

function makeThirdOfChordQuestionAndAnswer(chordName) {
    const chord = chords[chordName];
    return {
        question: `3rd of ${chord.name}`,
        answer: chord.iii,
    };
}

function makeSeventhOfChordQuestionAndAnswer(chordName) {
    const chord = chords[chordName];
    return {
        question: `7th of ${chord.name}`,
        answer: chord.vii,
    };
}

function makeQuestionsAndAnswers(keys) {
    const questionsAndAnswers = [];

    for (const key of keys) {
        questionsAndAnswers.push(makeV7QuestionAndAnswer(key));
        questionsAndAnswers.push(makeTwoQuestionAndAnswer(key));
        questionsAndAnswers.push(makeTwoFiveOneQuestionAndAnswer(key));
    }

    // for (const chord in chords) {
    //     questionsAndAnswers.push(makeThirdOfChordQuestionAndAnswer(chord));
    //     questionsAndAnswers.push(makeSeventhOfChordQuestionAndAnswer(chord));
    // }

    return questionsAndAnswers;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function selectRandomQuestionAndAnswer(questionsAndAnswers) {
    let i = getRandomInt(questionsAndAnswers.length);
    while (i === currentQuestionIndex) {
        i = getRandomInt(questionsAndAnswers.length);
    }
    currentQuestionIndex = i;
    return questionsAndAnswers[i];
}

const allQuestionsAndAnswers = makeQuestionsAndAnswers(keys);

const flashCardQuestionText = document.getElementById("flash-card-question");
const flashCardAnswerText = document.getElementById("flash-card-answer");

function nextQuestionAndAnswer() {
    flashCardAnswerText.style.visibility = "hidden";
    qa = selectRandomQuestionAndAnswer(allQuestionsAndAnswers);
    flashCardQuestionText.innerText = qa.question;
    flashCardAnswerText.innerText = qa.answer;
}

const showBtn = document.getElementById("show-btn");
showBtn.addEventListener("click", () => {
    flashCardAnswerText.style.visibility = "visible";
});

const nextBtn = document.getElementById("next-btn");
nextBtn.addEventListener("click", () => {
    nextQuestionAndAnswer();
});

nextQuestionAndAnswer();
