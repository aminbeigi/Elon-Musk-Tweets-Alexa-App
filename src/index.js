// sets up dependencies
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');

// core functionality for fact skill
const GetElonTweetHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetElonTweetIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    // gets a random fact by assigning an array to the variable
    // the random item from the array will be selected by the i18next library
    // the i18next library is set up in the Request Interceptor
    const randomElonTweet = requestAttributes.t('TWEETS');
    // concatenates a standard message with the random fact
    const speakOutput = requestAttributes.t('GET_TWEET_MESSAGE') + randomElonTweet;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      // Uncomment the next line if you want to keep the session open so you can
      // ask for another fact without first re-opening the skill
      .reprompt(requestAttributes.t('HELP_REPROMPT'))
      .withSimpleCard(requestAttributes.t('SKILL_NAME'), randomElonTweet)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('HELP_MESSAGE'))
      .reprompt(requestAttributes.t('HELP_REPROMPT'))
      .getResponse();
  },
};

const FallbackHandler = {
  // The FallbackIntent can only be sent in those locales which support it,
  // so this handler will always be skipped in locales where it is not supported.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('FALLBACK_MESSAGE'))
      .reprompt(requestAttributes.t('FALLBACK_REPROMPT'))
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('STOP_MESSAGE'))
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('ERROR_MESSAGE'))
      .reprompt(requestAttributes.t('ERROR_MESSAGE'))
      .getResponse();
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    // Gets the locale from the request and initializes i18next.
    const localizationClient = i18n.init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings,
      returnObjects: true
    });
    // Creates a localize function to support arguments.
    localizationClient.localize = function localize() {
      // gets arguments through and passes them to
      // i18next using sprintf to replace string placeholders
      // with arguments.
      const args = arguments;
      const value = i18n.t(...args);
      // If an array is used then a random value is selected
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    // this gets the request attributes and save the localize function inside
    // it to be used in a handler by calling requestAttributes.t(STRING_ID, [args...])
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    }
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetElonTweetHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('sample/basic-fact/v2')
  .lambda();

const enData = {
  translation: {
    SKILL_NAME: 'Elon Musk Tweets',
    GET_TWEET_MESSAGE: 'Here\'s an Elon tweet: ',
    HELP_MESSAGE: 'You can say tell me an Elon tweet, or, you can say exit... What can I help you with?',
    HELP_REPROMPT: 'What can I help you with?',
    FALLBACK_MESSAGE: 'The Elon Musk Tweets skill can\'t help you with that. It can help you discover Elon Musk Tweets if you say tell me give an Elon Musk Tweet. What can I help you with?',
    FALLBACK_REPROMPT: 'What can I help you with?',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    STOP_MESSAGE: 'Goodbye!',
    TWEETS:
      [
        'The ancient Egyptians were amazing, but if aliens built the pyramids, they would have left behind a computer or something.',
        'If there was a way that I could not eat, so I could work more, I would not eat.',
        'Who controls the memes, controls the Universe',
        'Sandwich time travel is the only explanation',
        'Tesla stock price is too high imo',
        'I am selling almost all physical possessions. Will own no house.',
        'The coronavirus panic is dumb',
        'Oh btw I\'m building a cyborg dragon',
        'Traffic is driving me nuts. Am going to build a tunnel boring machine and just start digging...',
        'I was always crazy on Twitter fyi',
        'My Twitter is pretty much complete nonsense at this point',
        'If life is a video game, the graphics are great, but the plot is confusing & the tutorial is way too long',
        'Nuke Mars!',
        'the color orange is named after the fruit',
        'Door hinge',
        'Tesla blows haha',
        'Technically, alcohol is a solution',
        'When the zombie apocalypse happens, you’ll be glad you bought a flamethrower. Works against hordes of the undead or your money back!',
        'The rumor that I’m secretly creating a zombie apocalypse to generate demand for flamethrowers is completely false',
        'You’d need millions of zombies for a so-called “apocalypse” anyway. Where would I even get a factory big enough to make so many!?',
        'Why is there no Flat Mars Society!?',
        'The rumor that I\'m building a spaceship to get back to my home planet Mars is totally untrue',
        'Apparently, there is this thing called "Dad jokes" and I make them',
        'If this works, I\'m treating myself to a volcano lair. It\'s time.',
        'A ceiling is simply a floor from below',
        'A little red wine, vintage record, some Ambien ... and magic!',
        'I will buy tons of your merch',
        'Don’t want to blow your mind, but I’m pretty weird. It’s time the world knew.',
        'His name is Gary & he’s a snail',
        'Gigafactory in units of hamster, 50 billion hamsters',
      ],
  },
};

// constructs i18n and l10n data structure
const languageStrings = {
  'en': enData,
};