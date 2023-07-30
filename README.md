# Star Wars People

Demo app showing basic information from Star Wars Characters using [SWAPI](https://swapi.dev/).

The idea is to showcase new Angular 16 features such as:

- Standalone components.
- Dependency injection without `constructor() {}` using `inject()` instead.
- Self-closing tags for custom components.
- Mark component inputs as required.
- New `takeUntilDestroyed()` operator to destroy subscriptions in the component's onDestroy lifecycle hook.
- Turning on server-side rendering and hydration.

## Tentative Lesson list

- Course Introduction and talking about the technologies to use.
- Quick tour of the demo app and show the things we'll talk about.
- Use the angular CLI to create a new app.
- Use the angular CLI to create the people page.
- Show the standalone flag, and show the IonicModule.
- Create the template for the People page and showcase a hardcoded list.
- Initialize component store in the application, create the state with hardcoded data.
- Create the people.service and add the HTTP calls to get the planet, films, and people.
- Create the effects. (_one effect per lesson to explain how they work_)
- Connect everything together to display the data from the API in the page.
- Create the infinite scroll view to fetch more people.
- Use a modal to display the person's details (_first a lesson where I explain the modal's properties._)
- Create a component for the detail of a person and show it on the modal.
- Connect the modal's header with the component store.
- Show the person's details inside of the modal.
- Set the input for the person as required.
