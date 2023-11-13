<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="Logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">KS Chat</h3>

  <p align="center">
   KMA Stranger Chat
    <br />
    More Chat. More fun!
    <br />
    <a href="http://localhost:3000/api-docs"><strong>APIs Doc »</strong></a>
    <br />
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## Installation

Following under steps for installing project

1. Install necessary extensions for VSCode:
   - Prettier: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
   - Eslint: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
   - Docker (optional): https://www.docker.com/products/docker-desktop/
1. Clone the repo
   ```sh
   git clone https://github.com/HVgiang86/ks-chat.git
   ```
1. Install NPM packages
   ```sh
   npm install
   ```
1. Run project
   ```js
   npm run start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Config APIs Documentation (for dev)

Following steps are used to configure API documentation page (for API designer)

1. **Create API in code**: of course :D
2. Copy content of file **'swagger.yaml'** to this editor: https://editor.swagger.io/ and start editing.
3. Create schemas object if need (Schemas object like a model that use in response and request json body)

<div align="center">
    <img src="https://i.imgur.com/BoXgpMI.png" alt="Logo" width="356" height="200">
</div>
<br />

4. Create tags if need

<div align="center">
    <img src="https://i.imgur.com/3RN0fxV.png" alt="Logo" width="356" height="200">
</div>
<br />

5. Create API in correct path with _security_ , **description**, **request**, **response**, **...**

<div align="center">
    <img src="https://i.imgur.com/TkGJY3R.png" alt="Logo" width="356" height="200">
</div>
<br />

6. You can check preview in the right side of page. Reload to reset the preview if need.
7. Choose **menu -> File -> Save as YAML** and replace it for current **swagger.yaml** file
<!-- USAGE EXAMPLES -->
