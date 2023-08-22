export const CreatePostValidation = (Title: string, Post: string, Image: string | undefined, HashTag: string[]) => {

    const Regex = /^.{10,}$/;

    if (!Regex.test(Title)) {
        return 'Title Should contain at least 10 characters';
    }

    const tempElement = document.createElement('div');
    const post = tempElement.innerHTML = Post;

    if (post.trim() === '') {
        return 'Add Content About Title';
    }

    if (Image?.trim() === '') {
        return 'Please Add Image';
    }
    if (HashTag.length === 0) {
        return 'Please Add HashTags';
      }
      


    return 'success';
};


export const EditPostValidation = (Title: string, Post: string) => {

    const Regex = /^.{10,}$/;

    if (!Regex.test(Title)) {
        return 'Title Should contain at least 10 characters';
    }

    const tempElement = document.createElement('div');
    const post = tempElement.innerHTML = Post;



    if (post === '') {
        return 'Add Content About Title';
    }
  

    return 'success';
};
