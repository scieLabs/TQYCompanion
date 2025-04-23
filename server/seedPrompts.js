import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Prompt from './models/promptSchema.js';

dotenv.config();

const prompts = [
  {
    season: "Spring",
    prompt_title: "♥A",
    prompt: "What group has the highest status in the community? What must people do to gain inclusion in this group? <br />OR... <br />Are there distinct family units in the community? If so, what family structures are common?",
    isSpecial: false,
    isProject: false
},
  {
    season: "Spring",
    prompt_title: "♥2",
    prompt: "There’s a large body of water on the map. Where is it? What does it look like? <br />OR... <br />There’s a giant, man-made structure on the map. Where is it? Why is it abandoned?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Spring",
    prompt_title: "♥3",
    prompt: "Someone new arrives. Who? <br />OR... <br />Two of the community’s younger membersget into a fight. What provoked them?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Spring",
    prompt_title: "♥4",
    prompt: "What important and basic tools does the community lack? <br />OR... <br />Where are you storing your food? Why is this a risky place to store things?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Spring",
    prompt_title: "♥5",
    prompt: "There is a disquieting legend about this place. What is it? <br />OR... <br />Alarming weather patterns destroy something. How and what?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Spring",
    prompt_title: "♥6",
    prompt: "Are there children in your community? If there are, what is their role in the community? <br />OR... <br />How old are the eldest members of the community? What special needs do they have?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Spring",
    prompt_title: "♥7",
    prompt: "Where does everyone sleep? Who is unhappy with this arrangement, and why? <br />OR... <br />What natural predators roam this area? Are you safe?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Spring",
    prompt_title: "♥8",
    prompt: "An old piece of machinery is discovered, broken but perhaps repairable. What is it? What would it be useful for? <br />OR... <br />An old piece of machinery is discovered, cursed and dangerous. How does the community destroy it?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Spring",
    prompt_title: "♥9",
    prompt: "A charismatic young girl convinces many to help her with an elaborate scheme. What is it? Who joins her endeavors? <strong>Start a project to reflect.</strong> <br />OR... <br />A charismatic young girl tries to tempt many into sinful or dangerous activity. Why does she do this? How does the community respond?",
    isSpecial: false,
    isProject: true
  },
  {
    season: "Spring",
    prompt_title: "♥10",
    prompt: "There’s another community somewhere on the map. Where are they? What sets them apart from you? <br />OR... <br />What belief or practice helps to unify your community?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Spring",
    prompt_title: "♥J",
    prompt: "You see a good omen. What is it? <br />OR... <br />You see a bad omen. What is it?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Spring",
    prompt_title: "♥Q",
    prompt: "What’s the most beautiful thing in this area? <br />OR... <br />What’s the most hideous thing in this area?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Spring",
    prompt_title: "♥K",
    prompt: "A young boy starts digging in the ground, and discovers something unexpected. What is it? <br />OR... <br />An old man confesses to past crimes and atrocities. What has he done?",
    isSpecial: false,
    isProject: false
  },
  //summer
  {
    season: "Summer",
    prompt_title: "♦A",
    prompt: "A contingent within the community demand to be heard. Who are they? What are they asking for? <br />OR... <br />A contingent within the community have acted on their frustrations. What have they damaged, and why did they damage it? Is it permanent?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Summer",
    prompt_title: "♦2",
    prompt: "Someone new arrives. Who? Why are they in distress? <br />OR... <br />Someone leaves the community. Who? What are they looking for?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Summer",
    prompt_title: "♦3",
    prompt: "Summer is a time for production and tending to the earth. <strong>Start a project related to food production.</strong> <br />OR... <br />Summer is a time for conquest and the gathering of might. <strong>Start a project related to military readiness and conquest.</strong>",
    isSpecial: false,
    isProject: true
  },
  {
    season: "Summer",
    prompt_title: "♦4",
    prompt: "The eldest among you dies. What caused the death? <br />OR... <br />The eldest among you is very sick. Caring for them and searching for a cure requires the help of the entire community. <strong>Do not reduce project dice this week.</strong>",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Summer",
    prompt_title: "♦5",
    prompt: "<strong>A project finishes early.</strong> What led to its early completion? <br />OR... <br />The weather is nice and people can feel the potential all around them. <strong>Start a new project.</strong>",
    isSpecial: false,
    isProject: true
  },
  {
    season: "Summer",
    prompt_title: "♦6",
    prompt: "Outsiders arrive in the area. Why are they a threat? How are they vulnerable? <br />OR... <br />Outsiders arrive in the area. How many? How are they greeted?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Summer",
    prompt_title: "♦7",
    prompt: "Introduce a mystery at the edge of the map. <br />OR... <br />An unattended situation becomes problematic and scary. What is it? How does it go awry?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Summer",
    prompt_title: "♦8",
    prompt: "Someone tries to take control of the community by force. Do they succeed? Why do they do this? <br />OR... <br />A headstrong community member decides to put one of their ideas in motion. <strong>Start a foolish project.</strong>",
    isSpecial: false,
    isProject: true
  },
  {
    season: "Summer",
    prompt_title: "♦9",
    prompt: "<strong>A project fails.</strong> Which one? Why? <br />OR... <br />Something goes foul and supplies are ruined. <strong>Add a new Scarcity.</strong>",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Summer",
    prompt_title: "♦10",
    prompt: "You discover a cache of supplies or resources. <strong>Add a new Abundance.</strong> <br />OR... <br />A Scarcity has gone unaddressed for too long!<strong>Start a project that will alleviate that Scarcity.</strong>",
    isSpecial: false,
    isProject: true
  },
  {
    season: "Summer",
    prompt_title: "♦J",
    prompt: "Predators and bad omens are afoot. You are careless, and someone goes missing under ominous circumstances. Who? <br />OR... <br />Predators and bad omens are afoot. What measures do you take to keep everyone safe and under surveillance? <strong>Do not reduce project dice this week.</strong>",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Summer",
    prompt_title: "♦Q",
    prompt: "<strong>A project finishes early.</strong> Which one? Why?<br /><br /> <em>If there are no projects underway,</em> boredom leads to quarrel. A fight breaks out between two people. What is it about?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Summer",
    prompt_title: "♦K",
    prompt: "Summer is fleeting. <strong>Take two actions this week and skip the next two weeks.</strong>",
    isSpecial: false,
    isProject: false
  },
  //autumn
  {
    season: "Autumn",
    prompt_title: "♣A",
    prompt: "The community becomes obsessed with a single project. Which one? Why? Choose one: <br />• They decide to take more time to ensure that it is perfect. <strong>Add 3 weeks to the project die.</strong> <br />• They drop everything else to work on it. <strong>All other projects fail.</strong> <br/><br /><em>If there are no projects underway,</em> the community becomes obsessed with a grandiose vision. <strong>Hold a discussion about this vision, in addition to your regular action for the week.</strong>",
    isSpecial: true,
    isProject: false
  },
  {
    season: "Autumn",
    prompt_title: "♣2",
    prompt: "Someone returns to the community. Who? Where were they? <br />OR... <br />You find a body. Do people recognize who it is? What happened?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Autumn",
    prompt_title: "♣3",
    prompt: "Someone leaves the community after issuing a dire warning. Who? What is the warning? <br />OR... <br />Someone issues a dire warning, and the community leaps into action to avoid disaster. What is the warning? <strong>Start a contentious project that relates to it.</strong>",
    isSpecial: false,
    isProject: true
  },
  {
    season: "Autumn",
    prompt_title: "♣4",
    prompt: "The strongest among you dies. What caused the death? <br />OR... <br />The weakest among you dies. Who’s to blame for their death?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Autumn",
    prompt_title: "♣5",
    prompt: "The Parish arrives. Who are they? Why have they chosen your community, and for what? <br />OR... <br />A small gang of marauders is making its way through local terrain. How many are there? What weapons do they carry?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Autumn",
    prompt_title: "♣6",
    prompt: "Introduce a dark mystery among the members of the community. <br />OR... <br />Conflict flares up among community members, and as a result, <strong>a project fails.</strong>",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Autumn",
    prompt_title: "♣7",
    prompt: "A project just isn’t working out as expected. <strong>Radically change the nature of this project (don’t modify the project die). When it resolves, you’ll be responsible for telling the community how it went.</strong> <br />OR... <br />Something goes foul and supplies are ruined. <strong>Add a new Scarcity.</strong>",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Autumn",
    prompt_title: "♣8",
    prompt: "Someone sabotages a project, and <strong>the project fails</strong> as a result. Who did this? Why? <br />OR... <br />Someone is caught trying to sabotage the efforts of the community. How does the community respond?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Autumn",
    prompt_title: "♣9",
    prompt: "The community works constantly and as a result <strong>a project finishes early.</strong> <br />OR... <br />A group goes out to explore the map more thoroughly, and finds something that had been previously overlooked.",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Autumn",
    prompt_title: "♣10",
    prompt: "Harvest is here and plentiful. <strong>Add an Abundance.</strong> <br />OR... <br />Cold autumn winds drive out your enemies. <strong>Remove a threatening force from the map and the area.</strong>",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Autumn",
    prompt_title: "♣J",
    prompt: "<strong>A project finishes early.</strong> Which one? Why?<br /><br /> <em>If there are no projects underway,</em> restlessness creates animosity, and animosity leads to violence. Who gets hurt?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Autumn",
    prompt_title: "♣Q",
    prompt: "Disease spreads through the community. Choose one: <br />• You spend the week quarantining and treating the disease. <strong>Project dice are not reduced this week.</strong> <br />• Nobody knows what to do about it. <strong>Add “Health and Fertility” as a Scarcity.</strong>",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Autumn",
    prompt_title: "♣K",
    prompt: "A natural disaster strikes the area. What is it? Choose one: <br />• You focus on getting everyone to safety. <strong>Remove an Abundance and a project fails.</strong> <br />• You focus on protecting your supplies and hard work at any cost. Several people die as a result",
    isSpecial: false,
    isProject: false
  },

  //winter
  {
    season: "Winter",
    prompt_title: "♠A",
    prompt: "Now is the time to conserve energy and resources. <strong>A project fails, but gain an Abundance.</strong> <br />OR... <br />Now is the time for hurried labour and final efforts. <strong>A project finishes early, but gain a Scarcity.</strong>",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Winter",
    prompt_title: "♠2",
    prompt: "A headstrong community member takes charge of the community’s work efforts. <strong>A project fails, and then a different project finishes early.</strong> <br />OR... <br />A headstrong community member tries to take control of the community. How are they prevented from doing this? <strong></strong>Due to the conflict, project dice are not reduced this week.</strong>",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Winter",
    prompt_title: "♠3",
    prompt: "Someone comes up with an ingenious solution to a big problem and as a result <strong>a project finishes early.</strong> What was their idea? <br />OR... <br />Someone comes up with a plan to ensure safety and comfort during the coldest months. <strong>Start a project related to this.</strong>",
    isSpecial: false,
    isProject: true
  },
  {
    season: "Winter",
    prompt_title: "♠4",
    prompt: "All the animals and young children are crying and won’t stop. <strong>Hold a discussion about this,</strong> in addition to your regular action for the week. <br />OR... <br />A great atrocity is revealed. What is it? Who uncovers it?",
    isSpecial: true,
    isProject: false
  },
  {
    season: "Winter",
    prompt_title: "♠5",
    prompt: "Winter elements destroy a food source. If this was your only food source, <strong>add a Scarcity.</strong> <br />OR... <br />Winter elements leave everyone cold, tired, and miserable. <strong>Project dice are not reduced this week.</strong>",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Winter",
    prompt_title: "♠6",
    prompt: "The time has come to consolidate your efforts and your borders. <strong>Projects located outside the settlement fail, and all remaining projects are reduced by 2 this week.</strong> <br />OR... <br />Someone finds a curious opportunity on the edge of the map. <strong>Start a project related to this discovery.</strong>",
    isSpecial: false,
    isProject: true
  },
  {
    season: "Winter",
    prompt_title: "♠7",
    prompt: "What is winter like in this area? How do community members react to the weather?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Winter",
    prompt_title: "♠8",
    prompt: "Winter is harsh, and desperation gives rise to fear mongering. Choose one: <br />• Spend the week calming the masses and dispelling their violent sentiments. <strong>The week ends immediately.</strong> <br />• Declare war on someone or something. <strong>This counts as starting a project.</strong>",
    isSpecial: false,
    isProject: true
  },
  {
    season: "Winter",
    prompt_title: "♠9",
    prompt: "Someone goes missing. They’re alone in the winter elements. Choose one: <br />• The community organizes constant search parties and eventually the person is found. <strong>Project dice are not reduced this week.</strong> <br />• No one ever hears from that person again.",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Winter",
    prompt_title: "♠10",
    prompt: "In preparation for the coming year, the community begins a huge undertaking. <strong>Start a project that will take at least 5 weeks to complete.</strong>",
    isSpecial: false,
    isProject: true
  },
  {
    season: "Winter",
    prompt_title: "♠J",
    prompt: "An infected outsider arrives, seeking amnesty. They have some much-needed resources with them. Choose one: <br />• Welcome them into the community. <strong>Remove a Scarcity,</strong> but also introduce an infection into the community. <br />• Bar them from entry. What Scarcity could they have addressed? How does its need become more dire this week?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Winter",
    prompt_title: "♠Q",
    prompt: "You see a good omen. What is it?",
    isSpecial: false,
    isProject: false
  },
  {
    season: "Winter",
    prompt_title: "♠K",
    prompt: "The Frost Shepherds arrive. <strong>The game is over.</strong>",
    isSpecial: false,
    isProject: false
  },

];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Prompt.deleteMany({});
    const result = await Prompt.insertMany(prompts);
    console.log('Prompts seeded:', result);
    process.exit();
  })
  .catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });