// Hardcoded tournament registrations (final list from final_fixture.csv),
// plus 5 placeholder Intelizign slots (Male Singles, Men's Doubles, Mixed Doubles). No backend — this array is the data source.
const participants = [
  {
    "id": 1,
    "name": "Lalit Wagh",
    "email": "lalit.wagh@ctgti.com",
    "categories": [
      "Male Singles",
      "Men's Doubles",
      "Mixed Doubles"
    ],
    "comments": null
  },
  {
    "id": 2,
    "name": "Gautam Sonkar",
    "email": "gautam.sonkar@ctgti.com",
    "categories": [
      "Male Singles",
      "Mixed Doubles",
      "Men's Doubles"
    ],
    "comments": "No Comments"
  },
  {
    "id": 3,
    "name": "Sameer Gupta",
    "email": "sameer.gupta@ctgti.com",
    "categories": [
      "Male Singles",
      "Men's Doubles",
      "Mixed Doubles"
    ],
    "comments": null
  },
  {
    "id": 4,
    "name": "Sarvesh Ghudus",
    "email": "sarvesh.ghudus@ctgti.com",
    "categories": [
      "Men's Doubles",
      "Male Singles"
    ],
    "comments": "Very beginner."
  },
  {
    "id": 5,
    "name": "Payal Jain",
    "email": "payal.jain@ctgti.com",
    "categories": [
      "Mixed Doubles",
      "Female Singles"
    ],
    "comments": "When is it scheduled?\nDo we need to carry our own badminton rackets?\nPlease conduct it in a closed court.\nPlan it on friday, not weekends."
  },
  {
    "id": 7,
    "name": "Sagar Nagade",
    "email": "sagar.nagade@ctgti.com",
    "categories": [
      "Male Singles",
      "Men's Doubles",
      "Mixed Doubles"
    ],
    "comments": null
  },
  {
    "id": 8,
    "name": "Pratik Bhong",
    "email": "pratik.bhong@ctgti.com",
    "categories": [
      "Male Singles",
      "Men's Doubles",
      "Mixed Doubles"
    ],
    "comments": null
  },
  {
    "id": 9,
    "name": "Sutonu Chakrabarti",
    "email": "sutonu.chakrabarti@ctgti.com",
    "categories": [
      "Male Singles",
      "Men's Doubles"
    ],
    "comments": null
  },
  {
    "id": 11,
    "name": "Sanskruti Nashikkar",
    "email": "sanskruti.nashikkar@ctgti.com",
    "categories": [
      "Female Singles",
      "Mixed Doubles"
    ],
    "comments": null
  },
  {
    "id": 12,
    "name": "Nitin Sagare",
    "email": "nitin.sagare@ctgti.com",
    "categories": [
      "Male Singles",
      "Men's Doubles",
      "Mixed Doubles"
    ],
    "comments": "All Good"
  },
  {
    "id": 13,
    "name": "Rahul Bhalerao",
    "email": "bhalerao.rahul@ctgti.com",
    "categories": [
      "Male Singles",
      "Men's Doubles",
      "Mixed Doubles"
    ],
    "comments": null
  },
  {
    "id": 14,
    "name": "Prasanna Kotkar",
    "email": "prasanna.kotkar@ctgti.com",
    "categories": [
      "Men's Doubles",
      "Mixed Doubles",
      "Male Singles"
    ],
    "comments": null
  },
  {
    "id": 15,
    "name": "Sanket Andure",
    "email": "sanket.andure@ctgti.com",
    "categories": [
      "Male Singles",
      "Men's Doubles",
      "Mixed Doubles"
    ],
    "comments": null
  },
  {
    "id": 16,
    "name": "Bhagyashree Patil",
    "email": "bhagyashree.patil@ctgti.com",
    "categories": [
      "Female Singles"
    ],
    "comments": null
  },
  {
    "id": 17,
    "name": "Om Shetti",
    "email": "om.shetti@ctgti.com",
    "categories": [
      "Male Singles",
      "Men's Doubles",
      "Mixed Doubles"
    ],
    "comments": null
  },
  {
    "id": 18,
    "name": "Sameerkumar Roy",
    "email": "sameerkumar.roy@ctgti.com",
    "categories": [
      "Male Singles",
      "Mixed Doubles",
      "Men's Doubles"
    ],
    "comments": null
  },
  {
    "id": 19,
    "name": "Aditi Kale",
    "email": "aditi.kale@ctgti.com",
    "categories": [
      "Female Singles"
    ],
    "comments": "womens doubles ka option nahi hai.."
  },
  {
    "id": 20,
    "name": "Avadhut Sakhare",
    "email": "avadhut.sakhare@ctgti.com",
    "categories": [
      "Men's Doubles",
      "Male Singles"
    ],
    "comments": null
  },
  {
    "id": 21,
    "name": "Aditya Parui",
    "email": "aditya.parui@ctgti.com",
    "categories": [
      "Male Singles",
      "Men's Doubles"
    ],
    "comments": null
  },
  {
    "id": 22,
    "name": "Aboli Dhote",
    "email": "aboli.dhote@ctgti.com",
    "categories": [
      "Mixed Doubles",
      "Female Singles"
    ],
    "comments": null
  },
  {
    "id": 23,
    "name": "Kamlesh Bawane",
    "email": "kamlesh.bawane@ctgti.com",
    "categories": [
      "Male Singles",
      "Men's Doubles",
      "Mixed Doubles"
    ],
    "comments": null
  },
  {
    "id": 25,
    "name": "Mohini Pande",
    "email": "mohini.pande@ctgti.com",
    "categories": [
      "Female Singles"
    ],
    "comments": null
  },
  {
    "id": 26,
    "name": "Prajwal Mahajan",
    "email": "prajwal.mahajan@ctgti.com",
    "categories": [
      "Men's Doubles"
    ],
    "comments": null
  },
  {
    "id": 27,
    "name": "Geetanjali Patil",
    "email": "geetanjali.patil@ctgti.com",
    "categories": [
      "Female Singles"
    ],
    "comments": null
  },
  {
    "id": 28,
    "name": "Shritish Bhamburkar",
    "email": "Shritish.Bhamburkar@ctgti.com",
    "categories": [
      "Male Singles"
    ],
    "comments": null
  },
  {
    "id": 29,
    "name": "Pranay Taneja",
    "email": "pranay.taneja@ctgti.com",
    "categories": [
      "Men's Doubles",
      "Mixed Doubles",
      "Male Singles"
    ],
    "comments": "Please keep my commute into consideration. Thanks a lot"
  },
  {
    "id": 30,
    "name": "Sohel Shaikh",
    "email": "sohel.shaikh@ctgti.com",
    "categories": [
      "Male Singles"
    ],
    "comments": null
  },
  {
    "id": 31,
    "name": "Prateek Choudhary",
    "email": "",
    "categories": [
      "Male Singles"
    ],
    "comments": null
  },
  {
    "id": 34,
    "name": "Vijay Gaikwad",
    "email": "",
    "categories": [
      "Mixed Doubles",
      "Men's Doubles",
      "Male Singles"
    ],
    "comments": "If Possible, Please add some Energy Drinks"
  },
  {
    "id": 35,
    "name": "Shubham Raut",
    "email": "",
    "categories": [
      "Mixed Doubles"
    ],
    "comments": null
  },
  {
    "id": 36,
    "name": "Rahul Sura",
    "email": "",
    "categories": [
      "Mixed Doubles",
      "Male Singles",
      "Men's Doubles"
    ],
    "comments": "I don’t know how to play, so I need an extra advantage."
  },
  {
    "id": 37,
    "name": "Prasanna Karvande",
    "email": "",
    "categories": [
      "Male Singles",
      "Men's Doubles",
      "Mixed Doubles"
    ],
    "comments": null
  },
  {
    "id": 38,
    "name": "Intelizign Player 1",
    "email": "",
    "categories": [
      "Male Singles",
      "Men's Doubles"
    ],
    "comments": "Intelizign slot — name to be confirmed",
    "org": "Intelizign"
  },
  {
    "id": 39,
    "name": "Intelizign Player 2",
    "email": "",
    "categories": [
      "Male Singles"
    ],
    "comments": "Intelizign slot — name to be confirmed",
    "org": "Intelizign"
  },
  {
    "id": 40,
    "name": "Intelizign Player 3",
    "email": "",
    "categories": [
      "Male Singles"
    ],
    "comments": "Intelizign slot — name to be confirmed",
    "org": "Intelizign"
  },
  {
    "id": 41,
    "name": "Intelizign Player 4",
    "email": "",
    "categories": [
      "Male Singles"
    ],
    "comments": "Intelizign slot — name to be confirmed",
    "org": "Intelizign"
  },
  {
    "id": 42,
    "name": "Intelizign Player 5",
    "email": "",
    "categories": [
      "Male Singles"
    ],
    "comments": "Intelizign slot — name to be confirmed",
    "org": "Intelizign"
  }
];

export default participants;
