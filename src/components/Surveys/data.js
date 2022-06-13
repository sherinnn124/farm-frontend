const surveys=[
    {
    id:1,
    surveyTitle:'survey one',
    surveyDescription:'description one',
    updated:'26-5-2022',
    treeId:'5',
    treeType:'mango',
    questions:[
        {
            question:'question one',
            answers:[],
            answerType:'text',
            required:true,
            labeling:true,
            color:''
        },
        {
            question:'question two',
            answers:['answer one','answer two'],
            answerType:'radio',
            required:false,
            labeling:true,
            color:''
        },
        {
            question:'question three',
            answers:['option three','option four'],
            answerType:'checkbox',
            required:false,
            labeling:true,
            color:''
        }
    ]
    }
]
export default surveys