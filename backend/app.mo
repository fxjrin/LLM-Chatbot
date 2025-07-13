import LLM "mo:llm";
import Text "mo:base/Text";

actor {
  stable var currentQuestion : Text = "";
  // stable var currentAnswer : Text = "";

  public func prompt(prompt : Text) : async Text {
    await LLM.prompt(#Llama3_1_8B, prompt)
  };

  public func chat(messages : [LLM.ChatMessage]) : async Text {
    let response = await LLM.chat(#Llama3_1_8B).withMessages(messages).send();

    switch (response.message.content) {
      case (?text) text;
      case null ""
    }
  };

  public func generateQuestion() : async Text {
    let question = await LLM.prompt(#Llama3_1_8B, "Buat satu soal matematika sederhana saja tingkat sd (contoh 1+5=?), tanpa jawaban.");
    currentQuestion := question;
    return currentQuestion;
  };  

  public func answer(userAnswer : Text) : async Text {
    // Validasi dengan AI, misal:
    let validationPrompt = "Apakah jawaban '" # userAnswer # "' benar untuk soal '" # currentQuestion # "? periksa jawaban dan berikan outputnya hanya 'SALAH' jika salah, atau 'BENAR' jika benar";
    let aiValidation = await LLM.prompt(#Llama3_1_8B, validationPrompt);
    return aiValidation
  };

}
