var React = require('react');
var xmlns = "http://www.w3.org/2000/svg";

var FloatingLabel = React.createClass({displayName: "FloatingLabel",
  getInitialProps: function() {
    return {
      dotPosition: []
    };
  },
  render: function() {
    var targetPos;
    for (var i = 0, len = this.props.dotPosition.length; i < len; i++) {
      var pos = this.props.dotPosition[i];
      if (pos.product.id === this.props.selectedOssId) {
        targetPos = pos;
        break;
      }
    }
    if (!targetPos) return React.createElement("div", null);
    var style = {
      backgroundColor: '#d9edf7',
      border: '1px solid #31708f',
      padding: '5px',
      position: 'absolute',
      top: targetPos.y + 10 + 'px',
      left: targetPos.x + 10 + 'px'
    };
    var key = "dot-" + this.props.num;
    return (
      React.createElement("div", {key: "floating-label", style: style}, 
        React.createElement("div", null, targetPos.product.name), 
        React.createElement("div", null, "総合スコア: ", targetPos.product.score)
      )
    );
  },

});

module.exports = FloatingLabel;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvRmxvYXRpbmdMYWJlbC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksS0FBSyxHQUFHLDRCQUE0QixDQUFDOztBQUV6QyxJQUFJLG1DQUFtQyw2QkFBQTtFQUNyQyxlQUFlLEVBQUUsV0FBVztJQUMxQixPQUFPO01BQ0wsV0FBVyxFQUFFLEVBQUU7S0FDaEIsQ0FBQztHQUNIO0VBQ0QsTUFBTSxFQUFFLFdBQVc7SUFDakIsSUFBSSxTQUFTLENBQUM7SUFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDakUsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDcEMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRTtRQUMvQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLE1BQU07T0FDUDtLQUNGO0lBQ0QsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLG9CQUFBLEtBQUksRUFBQSxJQUFPLENBQUEsQ0FBQztJQUNuQyxJQUFJLEtBQUssR0FBRztNQUNWLGVBQWUsRUFBRSxTQUFTO01BQzFCLE1BQU0sRUFBRSxtQkFBbUI7TUFDM0IsT0FBTyxFQUFFLEtBQUs7TUFDZCxRQUFRLEVBQUUsVUFBVTtNQUNwQixHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSTtNQUM1QixJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSTtLQUM5QixDQUFDO0lBQ0YsSUFBSSxHQUFHLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBQ2xDO01BQ0Usb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxHQUFBLEVBQUcsQ0FBQyxnQkFBQSxFQUFnQixDQUFDLEtBQUEsRUFBSyxDQUFFLEtBQU8sQ0FBQSxFQUFBO1FBQ3RDLG9CQUFBLEtBQUksRUFBQSxJQUFDLEVBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFXLENBQUEsRUFBQTtRQUNuQyxvQkFBQSxLQUFJLEVBQUEsSUFBQyxFQUFBLFNBQUEsRUFBUSxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQVksQ0FBQTtNQUN2QyxDQUFBO01BQ047QUFDTixHQUFHOztBQUVILENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDIiwiZmlsZSI6ImNvbXBvbmVudHMvRmxvYXRpbmdMYWJlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgeG1sbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbnZhciBGbG9hdGluZ0xhYmVsID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsUHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkb3RQb3NpdGlvbjogW11cbiAgICB9O1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0YXJnZXRQb3M7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMucHJvcHMuZG90UG9zaXRpb24ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhciBwb3MgPSB0aGlzLnByb3BzLmRvdFBvc2l0aW9uW2ldO1xuICAgICAgaWYgKHBvcy5wcm9kdWN0LmlkID09PSB0aGlzLnByb3BzLnNlbGVjdGVkT3NzSWQpIHtcbiAgICAgICAgdGFyZ2V0UG9zID0gcG9zO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF0YXJnZXRQb3MpIHJldHVybiA8ZGl2PjwvZGl2PjtcbiAgICB2YXIgc3R5bGUgPSB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZDllZGY3JyxcbiAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjMzE3MDhmJyxcbiAgICAgIHBhZGRpbmc6ICc1cHgnLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB0b3A6IHRhcmdldFBvcy55ICsgMTAgKyAncHgnLFxuICAgICAgbGVmdDogdGFyZ2V0UG9zLnggKyAxMCArICdweCdcbiAgICB9O1xuICAgIHZhciBrZXkgPSBcImRvdC1cIiArIHRoaXMucHJvcHMubnVtO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGtleT1cImZsb2F0aW5nLWxhYmVsXCIgc3R5bGU9e3N0eWxlfT5cbiAgICAgICAgPGRpdj57dGFyZ2V0UG9zLnByb2R1Y3QubmFtZX08L2Rpdj5cbiAgICAgICAgPGRpdj7nt4/lkIjjgrnjgrPjgqI6IHt0YXJnZXRQb3MucHJvZHVjdC5zY29yZX08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0sXG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZsb2F0aW5nTGFiZWw7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=