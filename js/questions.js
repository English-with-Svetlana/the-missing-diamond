(function () {
  "use strict";

  const evidence = (text) => ({ important: true, text });

  window.GAME_QUESTIONS = [
    { id: 1, round: 1, type: "find-error", sentence: "The museum close at 9 p.m.", target: "close", correction: "closed", evidence: evidence("The museum closed at 9:00 p.m.") },
    { id: 2, round: 1, type: "find-error", sentence: "The alarm ringed at 9:40 p.m.", target: "ringed", correction: "rang" },
    { id: 3, round: 1, type: "find-error", sentence: "The guard don't remember seeing anyone.", target: "don't", correction: "doesn't" },
    { id: 4, round: 1, type: "find-error", sentence: "Someone open the display case.", target: "open", correction: "opened" },
    { id: 5, round: 1, type: "find-error", sentence: "The window wasn't broke.", target: "broke", correction: "broken", evidence: evidence("The window was not broken.") },
    { id: 6, round: 1, type: "find-error", sentence: "There was a small metal piece in the floor.", target: "in", correction: "on", evidence: evidence("A small metal piece was found near the display case.") },
    { id: 7, round: 1, type: "find-error", sentence: "The thief didn't used the main door.", target: "used", correction: "use" },
    { id: 8, round: 1, type: "find-error", sentence: "Emma has a key of the exhibition room.", target: "of", correction: "to" },
    { id: 9, round: 1, type: "find-error", sentence: "The security camera stop working at 9:20.", target: "stop", correction: "stopped", evidence: evidence("Camera 3 stopped working at 9:20.") },
    { id: 10, round: 1, type: "find-error", sentence: "Someone was inside the museum after it has closed.", target: "has", correction: "had", evidence: evidence("Someone was still inside the museum after closing time.") },
    { id: 11, round: 2, type: "multiple-choice", sentence: "Emma said she ___ in her office at 9:30.", answers: ["IS", "WAS", "WERE"], correct: "WAS" },
    { id: 12, round: 2, type: "multiple-choice", sentence: "She ___ working on a report when the alarm rang.", answers: ["IS", "WAS", "HAS"], correct: "WAS" },
    { id: 13, round: 2, type: "multiple-choice", sentence: "The computer shows that she ___ a file at 9:32.", answers: ["SAVED", "SAVE", "HAS SAVE"], correct: "SAVED", evidence: evidence("Emma saved a document at 9:32.") },
    { id: 14, round: 2, type: "multiple-choice", sentence: "James said he ___ the second floor.", answers: ["WAS CHECKING", "CHECKS", "HAS CHECK"], correct: "WAS CHECKING" },
    { id: 15, round: 2, type: "multiple-choice", sentence: "He ___ the security room at 9:35.", answers: ["LEAVES", "LEFT", "HAS LEAVE"], correct: "LEFT" },
    { id: 16, round: 2, type: "multiple-choice", sentence: "Another camera ___ James on the second floor.", answers: ["RECORDED", "RECORD", "WAS RECORD"], correct: "RECORDED", evidence: evidence("James was on the second floor at 9:37.") },
    { id: 17, round: 2, type: "multiple-choice", sentence: "Oliver said he ___ the museum at 9:00.", answers: ["LEFT", "LEAVE", "LEAVES"], correct: "LEFT" },
    { id: 18, round: 2, type: "multiple-choice", sentence: "He said he ___ home before the alarm rang.", answers: ["HAD GONE", "WENT", "HAS GONE"], correct: "HAD GONE" },
    { id: 19, round: 2, type: "multiple-choice", sentence: "Oliver said he ___ returned to the museum.", answers: ["HAD NEVER", "NEVER", "HAS NEVER"], correct: "HAD NEVER" },
    { id: 20, round: 2, type: "multiple-choice", sentence: "The detective thinks that one suspect ___ lying.", answers: ["IS", "ARE", "WERE"], correct: "IS" },
    { id: 21, round: 3, type: "multiple-choice", sentence: "By the time the police arrived, the thief ___.", answers: ["ESCAPED", "HAD ESCAPED", "HAS ESCAPED"], correct: "HAD ESCAPED" },
    { id: 22, round: 3, type: "multiple-choice", sentence: "Emma ___ her computer at 9:32.", answers: ["WAS USING", "USE", "HAS USED"], correct: "WAS USING" },
    { id: 23, round: 3, type: "multiple-choice", sentence: "James ___ on camera at 9:37.", answers: ["WAS SEEN", "SAW", "HAS SEE"], correct: "WAS SEEN" },
    { id: 24, round: 3, type: "multiple-choice", sentence: "Oliver said that he ___ before 9:00.", answers: ["HAD LEFT", "HAS LEFT", "LEAVES"], correct: "HAD LEFT" },
    { id: 25, round: 3, type: "multiple-choice", sentence: "But his camera ___ a photo at 9:27.", answers: ["UPLOADED", "UPLOAD", "WAS UPLOAD"], correct: "UPLOADED", evidence: evidence("Oliver's camera uploaded a photo at 9:27 p.m.") },
    { id: 26, round: 3, type: "multiple-choice", sentence: "The photo was taken ___ the museum.", answers: ["IN", "ON", "AT"], correct: "IN", evidence: evidence("Oliver was still inside the museum at 9:27.") },
    { id: 27, round: 3, type: "multiple-choice", sentence: "The metal piece belongs ___ a camera strap.", answers: ["TO", "FOR", "WITH"], correct: "TO" },
    { id: 28, round: 3, type: "multiple-choice", sentence: "Oliver's camera strap ___ damaged.", answers: ["WAS", "WERE", "IS BEEN"], correct: "WAS", evidence: evidence("The metal piece matches Oliver's damaged camera strap.") },
    { id: 29, round: 3, type: "multiple-choice", sentence: "Someone ___ Camera 3 before taking the diamond.", answers: ["DISABLED", "DISABLE", "HAS DISABLE"], correct: "DISABLED" },
    { id: 30, round: 3, type: "multiple-choice", sentence: "The thief ___ access to the exhibition before the robbery.", answers: ["HAD", "HAS", "HAVE"], correct: "HAD" }
  ];
})();
