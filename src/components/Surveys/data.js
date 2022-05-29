const surveys=[
    {
    id:1,
    surveyTitle:'survey one',
    surveyDescription:'description one',
    updated:'26-5-2022',
    treeType:'mango',
    questions:[
        {
            question:'question one',
            answers:[],
            answerType:'text',
            required:true,
            labeling:true
        },
        {
            question:'question two',
            answers:['answer one','answer two'],
            answerType:'radio',
            required:false,
            labeling:true
        },
        {
            question:'question three',
            answers:['option three','option four'],
            answerType:'checkboxes',
            required:false,
            labeling:true
        }
    ]
    }
]
export default surveys