export default {
    name: 'postedBy',
    title: 'PostedBy',
    type: 'reference',
    to: [{type: 'user'}] // postedBy is a reference to a user, so it will display as a field where you can select a list of your users
}