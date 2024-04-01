// Initialize Supabase client
const supabase = createClient('your-supabase-url', 'your-supabase-anon-key');

async function fetchPosts() {
    // Assuming 'posts' is your table name
    let { data: articles, error } = await supabase
        .from('posts')
        .select('*')
        .is('archived', false); // Adjust based on your table structure

    let { data: archived, error: archivedError } = await supabase
        .from('posts')
        .select('*')
        .is('archived', true); // Adjust based on your table structure

    if (error || archivedError) {
        console.error('Error fetching posts', error || archivedError);
        return;
    }

    // Function to display posts in HTML
    displayPosts(articles, 'articles');
    displayPosts(archived, 'archived');
}

function displayPosts(posts, elementId) {
    const container = document.getElementById(elementId);
    posts.forEach(async post => {
        const postElement = document.createElement('div');
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <div class="post-images" id="images-${post.id}"></div>
        `;
        container.appendChild(postElement);

        // Fetch and display images for the post
        const imagesContainer = document.getElementById(`images-${post.id}`);
        const images = await fetchImagesForPost(post.id); // Implement this function based on your images table
        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = image.url; // Use the actual path to your image
            imagesContainer.appendChild(imgElement);
        });
    });
}


// Fetch posts on page load
document.addEventListener('DOMContentLoaded', fetchPosts);
