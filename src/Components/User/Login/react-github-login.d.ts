// react-github-login.d.ts

declare module 'react-github-login' {
    import * as React from 'react';
  
    interface GitHubLoginProps {
      clientId: string;
      redirectUri: string;
      onSuccess(response: any): void;
      onFailure(error: any): void;
      buttonText?: string;
      className?: string;
    }
  
    export default class GitHubLogin extends React.Component<GitHubLoginProps> {}
  }
  