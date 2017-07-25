# AngularPrint
An Angular module that allows users to selectively print elements, as well as provides optimizations for printing. By default, printing margins are minimized.

<h2>Installation</h2>
<ul>
  <li>make sure bower is installed</li>
  <li>navigate to the root directory of your project and execute the command "bower install angular-print"</li>
  <li>import module to your Angular app using the name "AngularPrint"</li>
</ul>

<h2>Using AngularPrint</h2>
<h4>printSection</h4>
  <ul>
    <li>Directive type: Attribute</li>
    <li>Makes element and its children visible for printing</li>
  </ul>
  ```html
  <div>
      <div print-section>
        I'll print
        <p>Me, too!</p>
      </div>
      <div>I won't</div>
  </div>
  ```
<h4>printOnly</h4>
  <ul>
    <li>Directive type: Attribute</li>
    <li>Makes element and its children only visible for printing</li>
  </ul>
  ```html
  <div print-section>
      <div print-only>
        I'll print, but until then nobody wants me
        <p>Me, too!</p>
      </div>
      <div>Me, too! Except that people still want to look at me in the meantime...</div>
  </div>
  ```
<h4>printHide</h4>
  <ul>
    <li>Directive type: Attribute</li>
    <li>Makes element invisible during printing, but it is replaced by blank space</li>
  </ul>
  ```html
  <div print-section>
      <div print-hide>
        I won't print
        <p>Me, either</p>
      </div>
      <div>I'll print, but those bozos upstairs are still taking up space</div>
  </div>
  ```
<h4>printRemove</h4>
  <ul>
    <li>Directive type: Attribute</li>
    <li>Makes element invisible during printing</li>
  </ul>
  ```html
  <div print-section>
      <div print-remove>
        I won't print
        <p>Me, either</p>
      </div>
      <div>I'll print, and those bozos upstairs will finally stop making such a ruckus</div>
  </div>
  ```
<h4>printIf</h4>
  <ul>
    <li>Directive type: Attribute</li>
    <li>Toggles print-visibility based on expression</li>
  </ul>
  ```html
  <!--Pigs do not yet fly, so this div, despite having print-section, will not print-->
  <div print-section print-if="pigsFly"></div>
  <!--Sam IS the best, so this div will print, despite not having print-section-->
  <div print-if="samIsTheBest"></div>
  ```
<h4>printBtn</h4>
  <ul>
    <li>Directive type: Attribute</li>
    <li>Adds onClick callback to element that will trigger printing</li>
  </ul>
  ```html
  <button print-btn>Doesn't matter where you put me</button>
  <span print-btn>I will make anything cause a print</span>
  <p print-btn>to happen if you click me</p>
  ```
<h4>printLandscape</h4>
  <ul>
    <li>Directive type: Attribute</li>
    <li>Will cause printing to be landscape instead of portrait</li>
  </ul>
  ```html
  <button print-landscape>Doesn't matter where you put me</button>
  <span print-landscape>I will cause any print</span>
  <p print-landscape>to be landscape</p>
  ```
  <h4>printAvoidBreak</h4>
  <ul>
    <li>Directive type: Attribute</li>
    <li>Prevents page breaks on element</li>
  </ul>
  ```html
  <button print-avoid-break>This element won't get split by page breaks</button>
  ```
<h4>printTable</h4>
  <ul>
    <li>Directive type: Attribute</li>
    <li>Optimizes table for printing. This includes keeping 'td' cell content from being cut-off by page breaks.</li>
    <li>Must be passed an array scope object representing the data presented by the table</li>
    <li>Column headers will persist between pages only if the ```<thead>``` and ```<tbody>``` tags are used correctly</li>
  </ul>
  This example shows adjustments to an already-visible table in order to tailor it for printing
  ```html
  <table print-table="people">
    <thead>
      <tr>
        <td print-remove>Unwanted field</td>
        <td>Name</td>
        <td>Address</td>
        <td>Phone</td>
      </tr>
    </thead>
    <tbody>
      <tr ng-repeat="person in people">
        <td print-remove>{{person.unwantedInfo}}</td>
        <td>{{person.name}}</td>
        <td>{{person.address}}</td>
        <td>{{person.phone}}</td>
      </tr>
    </tbody>
  </table>      
  ```
  This example shows a table made to only be visible during printing
  ```html
  <table print-table="people" print-only>
    <thead>
      <tr>
        <td>Name</td>
        <td>Address</td>
        <td>Phone</td>
      </tr>
    </thead>
    <tbody>
      <tr ng-repeat="person in people">
        <td>{{person.name}}</td>
        <td>{{person.address}}</td>
        <td>{{person.phone}}</td>
      </tr>
    </tbody>
  </table>      
  ```
