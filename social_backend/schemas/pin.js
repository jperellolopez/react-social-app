// A pin is an image who appears on a list in the home page. It is connected to the user who posted it. It has a title, a description, a link, a category... 

export default {
    name: 'pin',
    title: 'Pin',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string'
        },
        {
            name: 'about',
            title: 'About',
            type: 'string'
        },
        {
            name: 'destination',
            title: 'Destination',
            type: 'url'
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string'
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'userId',
            title: 'UserID',
            type: 'string'
        },
        {
            name: 'postedBy',
            title: 'PostedBy',
            type: 'postedBy'
        },
        {
            name: 'save',
            title: 'Save',
            type: 'array',
            of: [{type:'save'}] // needs a new schema
        },
        {
            name: 'comments',
            title: 'Comments',
            type: 'array',
            of: [{type:'comment'}] // needs a new schema
        }
    ]
}

