# github Actions 이란?

: github에서 자체적으로 제공하는 CI/CD 툴 


>## github Actions 툴의 구성 요소
>>### Events
>> :  github 에서 발생할 수 있는 대부분의 이벤트를 정의할 수 있다.
>>
>>- 내 PR을 main branch로 merge 할 때, 특정 이벤트를 발생시켜야할 경우
>>- commit 을 push 할 때 특정 이벤트를 발생시켜야할 경우
>>- 새로운 이슈를 누군가가 만들거나 열 때 특정 이벤트를 발생시켜야하는 경우
>>### Workflows
>>
>> : 특정 이벤트 발생 시, 내가 어떤 일을 수행하고 싶은지 명시할 수 있는 것 <br/>
>> : 한마디로 요리책과 같음. (Event 는 요리 메뉴) </br>
>> : 하나 또는 다수의 Job 을 포함할 수 있다.
>>### Jobs
>>
>> :  기본적으로는 병렬적으로 동시에 수행될 수도 있고, 순차적으로 수행되게 만들 수도 있다.</br>
>> : 하나의 Job 에는 어떤 순서대로 실행되어야 하는지 step을 명시할 수 있다.</br>
>> : `npm install` 같은 명령어도 실행 가능 
>>### Actions
>> : Job의 step 내부에서 action 사용 가능</br>
>> : npm 라이브러리처럼 github actions에 내장되어있는 action들을 필요에 따라 가져다쓰면 된다.
>>### Runners
>> : Job을 실행하는 머신 </br>
>> : 하나의 Job 은 하나의 독립적인 Runner에서 실행된다.</br>
>> : VM 과 비슷한 개념
> ## github Actions 사용 방법

---
>> ### 1. workflows 파일 생성
>> 
>>   : 프로젝트 경로에 .github/workflows/[workflow 명].yml 을 생성한다.
>> 
>> ```powershell
>> name: <workflow 명>
>> on: [<EVENT>]
>> jobs: 
>> 	<JOB 명칭>:
>> 		<runner type>: 
>> 		<steps> :
>> 			- <ACTION1>:
>> 			- <ACTION2>:
>> 			... 
>> ```
>> 
>>![image](https://user-images.githubusercontent.com/53039583/177030074-b7aeed3b-2479-486c-bf92-1def283347bd.png)

# Q&A

>## Q. npm ci 란? 그렇다면 yarn ci 는?
>>
>>- 자세히
>>    
>>    ### npm ci
>>    
>>       : ci환경인 여러 환경에서 clean install을 할 때 lock 파일에 의존하여 설치한다. 먼저 
>>    `npm ci` 의 5가지 특성은 아래와 같다.
>>    
>>    - `package-lock.json` or `npm-shrinkwrap.json` 파일이 **무조건 존재**해야 한다.
>>    - `package-lock.json` and `package.json` dependencies가 맞지 않으면 **lock파일을 업데이트 하지 않고 에러를 발생**시킨다.
>>    - `npm ci`는 **전체를 대상으로 install** 하며 개별적으로는 불가능하다.
>>    - 이미  `node_modules`  가 존재하는 경우에는 `npm ci` 실행 전에  node_modules 를 지우고 실행한다.
>>    - `package-lock.json` and `package.json` 에는 어떠한 기록도 하지 않는다.
>>    
>>    ### yarn ci
>>    
>>      : 보통 아래의 명령어로 사용되고 있었는데 오래되었으며 곧 없어질 것이라고 한다.
>>    
>>    ```bash
>>    # standard command
>>    $yarn install --frozen-lockfile
>>    ```
>>    
>>      : 최근에는 아래의 명령어로 사용되고 있다.
>>    
>>    ```bash
>>    $yarn install --immutable --immutable-cache --check-cache
>>    ```
>>    
>>
>## Q. job 을 직렬로 실행하고 싶을 때?
>>
>>- 자세히
>>    - workflows 내부에 job1, job2 가 있을 때 job1 → job2 순 설로 실고하 싶을 때는  job2 내부에 `needs: <job1>` 형식을 정의한다.
>>    - 예를 들어, **setup-dependencies** 라는 job 을 먼저 실행시킨 후,  **test** 라는 job 을 실행시키고 싶다면, 아래와 같이 test job 내부에 `needs: setup-dependencies` 를 정의한다.
>>        
>>        ```bash
>>        # workflows.yml
>>        # setup-dependencies -> test 순서로 job을 실행시키고 싶을 때
>>        name: Example CI
>>        
>>        on:
>>          push:
>>            branches: [ "main" ]
>>          pull_request:
>>            branches: [ "main" ]
>>        
>>        jobs:
>>          setup-dependencies:   #job1
>>            runs-on: ubuntu-latest
>>            steps:
>>              - uses: actions/checkout@v3
>>              - name: yarn dependencies
>>                uses: borales/actions-yarn@v3.0.0
>>                with:
>>                  cmd: install --immutable --immutable-cache --check-cache
>>          
>>          test:   #job2
>>            needs: setup-dependencies
>>            runs-on: ubuntu-latest
>>            steps:
>>              - uses: actions/checkout@v3
>>              - uses: borales/actions-yarn@v3.0.0
>>                with: 
>>                  cmd: install 
>>              - uses: borales/actions-yarn@v3.0.0
>>                with: 
>>                  cmd: test 
>>        
>>              - name: Use Node.js 16.x
>>                uses: actions/setup-node@v3
>>                with:
>>                  node-version: 16.x
>>                  cache: 'yarn'
>>              - run: yarn install --immutable --immutable-cache --check-cache
>>              - run: yarn ci
>>              - run: yarn test
>>        ```
        

# Errors

---

>## [Error] TestingLibraryElementError: Unable to find an element with the text: …
>>
>>    ### 증상
>>    
>>    ```powershell
>>    yarn run v1.22.19
>>    $ react-scripts test
>>    FAIL src/App.test.js
>>      ✕ renders learn react link (46 ms)
>>      ● renders learn react link
>>        TestingLibraryElementError: Unable to find an element with the text: /learn react/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
>>        Ignored nodes: comments, <script />, <style />
>>    <body>
>>    <div>
>>    <div
>>    class="App"
>>    >
>>    <div>
>>    <input
>>    type="number"
>>    />
>>    <input
>>    type="number"
>>    />
>>    </div>
>>    </div>
>>    </div>
>>    </body>
>>          4 | test('renders learn react link', () => {
>>          5 |   render(<App />);
>>        > 6 |   const linkElement = screen.getByText(/learn react/i);
>>            |                              ^
>>          7 |   expect(linkElement).toBeInTheDocument();
>>          8 | });
>>          9 |
>>          at Object.getElementError (node_modules/@testing-library/dom/dist/config.js:40:19)
>>          at node_modules/@testing-library/dom/dist/query-helpers.js:90:38
>>          at node_modules/@testing-library/dom/dist/query-helpers.js:62:17
>>          at getByText (node_modules/@testing-library/dom/dist/query-helpers.js:111:19)
>>          at Object.<anonymous> (src/App.test.js:6:30)
>>          at TestScheduler.scheduleTests (node_modules/@jest/core/build/TestScheduler.js:333:13)
>>          at runJest (node_modules/@jest/core/build/runJest.js:404:19)
>>          at _run10000 (node_modules/@jest/core/build/cli/index.js:320:7)
>>          at runCLI (node_modules/@jest/core/build/cli/index.js:173:3)
>>    Test Suites: 1 failed, 1 total
>>    Tests:       1 failed, 1 total
>>    Snapshots:   0 total
>>    Time:        1.683 s
>>    Ran all test suites.
>>    error Command failed with exit code 1.
>>    info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
>>    ```
>>    
>>    ### 원인
>>    
>>     : react 에서 test 시, 기본적으로 생성해주는 App.test.js 에서 <App/> 컴포넌트에 ‘`learn react`’ 라는 텍스트가 있는지 테스트하는 구문의 정의되어 있다.
>>     하지만, 실제 프로젝트에서 learn react 라는 텍스트 구문을 찾을 수 없어서 이 에러가 발생하는 것이다.
>>    
>>     
>>    
>>    ```jsx
>>    // App.test.js
>>    // default Code
>>    // 설명 : <App/> 을 렌더링 -> 렌더링된 screen document 에서 'learn react' 라는 텍스트가 있는지 체크
>>    
>>    test('renders learn react link', () => {
>>    	render(<App />);
>>    	const linkElement = screen.getByText(/learn react/i);
>>    	expect(linkElement).toBeInTheDocument();
>>    });
>>    ```
>>    
>>    ### 솔루션
>>    
>>    - App.test.js 파일에서 해당 구문을 주석처리 및 삭제하여 해결하였다.

>## [Error] every step must define a `uses` or `run` key    
>>  ### 증상
>>  ![image](https://user-images.githubusercontent.com/53039583/177030184-512f10a6-34f5-4344-a500-d816a68e643f.png)   
>>    ### 원인 
>>   : workflows 파일 내부에 job 의 step 단계에서 `name` key 다음에는 하나의 `uses` key가 존재해야하는데,  똑같은 depth (`-uses`) 으로 선언해서 발생하였다.
>>    
>>      ```bash
>>      - name: yarn dependencies
>>      - uses: borales/actions-yarn@v3.0.0
>>        with:
>>          cmd: install --immutable --immutable-cache --check-cache
>>      ```
>>    ### 솔루션
>>    - 따라서, name 뒤에 오는 uses key를 하위 depth 로 수정하여 해결되었다.
>>        
>>      ```bash
>>      - name: yarn dependencies
>>        uses: borales/actions-yarn@v3.0.0
>>        with:
>>          cmd: install --immutable --immutable-cache --check-cache
>>      ```