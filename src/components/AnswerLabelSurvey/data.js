const survey={
  id:1,
  surveyTitle:'survey one',
  surveyDescription:'description one',
  updated:'26-5-2022',
  treeType:'mango',
  treeId:'15',
  questions:[
      {
          question:'question one?',
          answers:[],
          answerType:'text',
          required:true,
          labeling:true,
          color:'25c178'
      },
      {
          question:'question twoooooooooooo?',
          answers:['answer one','answer two','answer three','answer four','answer five'],
          answerType:'radio',
          required:false,
          labeling:true,
          color:'7f075b'
      },
      {
          question:'question three?',
          answers:['option three','option four','option five','option six','option seven'],
          answerType:'checkbox',
          required:false,
          labeling:true,
          color:'002cda'
      }
  ]
}

export default survey