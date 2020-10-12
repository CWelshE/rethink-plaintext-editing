// React deps.
import React from 'react';
import PropTypes from 'prop-types';

// Ace imports - could probably dynamically require only needed file
// types, but that's beyond the scope of this project.
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json';

// Any CSS modules to be used here.
import css from './style.css';

// Set editor mode based on file type
const FILE_MIME_TYPES = {
  "text/plain_text": "text",
  "text/markdown": "markdown",
  "text/javascript": "javascript",
  "application/json": "json",
};

class DynamicEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      loadedName: '',
    }
  }

  // Asynchronously stream the file contents to `value` when we first
  // open the file in question
  getFile(blob) {
    blob.text().then(text => {
      this.setState({
        value: text,
      })
    });
  }

  // Load file on update if we have a new file
  componentDidUpdate() {
    const fileName = this.props.file.name;
    if(this.state.loadedName !== fileName) {
      this.getFile(this.props.file);
      this.setState({
        loadedName: fileName,
      });
    }
  }

  // Load file on first mount
  componentDidMount() {
    this.getFile(this.props.file);
  }

  // Write new files on user input
  // (In a real app, this would almost certainly be debounced to avoid
  // excessive network and memory usage, but this is probably good
  // enough for what we need.)
  writeNewFile() {
    const newFile = new File(
      [this.state.value],
      this.props.file.name,
      {type: this.props.file.type});
    this.props.write(newFile);
  }

  // Handle user input
  onChange(val) {
    this.setState({
      value: val
    });
    this.writeNewFile();
  }

  render() {
    return (
      <div>
        <h2 className={css["editor-header"]}>{this.props.file.name}</h2>
        <AceEditor
          key={this.props.file.name}
          mode={FILE_MIME_TYPES[this.props.file.type]}
          theme="monokai"
          value={this.state.value}
          name="ace-editor-top"
          editorProps={{ $blockScrolling: true, }}
          wrapEnabled={true}
          onChange={(val) => this.onChange(val)}
        />
      </div>
    );
  }
}

DynamicEditor.propTypes = {
  file: PropTypes.object.isRequired,
  write: PropTypes.func.isRequired,
};

export default DynamicEditor;
