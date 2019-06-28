import Controller from '@ember/controller';

var idGenerator = 0;

export default Controller.extend({
});

function getID()
{
  return idGenerator + 1;
}
