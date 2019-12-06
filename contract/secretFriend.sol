pragma solidity ^0.4.25;
//["0x8d46Fa0ecAf7DE3E3d7E09dcc0153040F061FBDB", "0x69FB2a80542721682BFe8daA8FEE847cDDD1a267",  "0x9334f0aa74d2744B97b0B1bE6896788eE46F4aAA", "0xf083D1B1112462f8F0fA827687aD07a09E21f523"]

//"0x8d46Fa0ecAf7DE3E3d7E09dcc0153040F061FBDB", "0x69FB2a80542721682BFe8daA8FEE847cDDD1a267", 10

//"0x9334f0aa74d2744B97b0B1bE6896788eE46F4aAA", "0x69FB2a80542721682BFe8daA8FEE847cDDD1a267", 30

//"0xf083D1B1112462f8F0fA827687aD07a09E21f523", "0x69FB2a80542721682BFe8daA8FEE847cDDD1a267", 5

contract SecretFriend{
    
    address public owner;
    address[] public participants_address;
    bool public signups_open = true;
    Cheat[] cheating_list;
    
    event Joined(address participant);
    event Assigned(address santa, address to);
    
    struct Cheat{
        address user;
        uint value;
        address avoid;
    }
    
    constructor() public{
        owner = msg.sender;
    }
    
    function join(address[] data) public{
        require(signups_open);
        for (uint i = 0; i < data.length; i++) {
            participants_address.push(data[i]);
            emit Joined(data[i]);
        }
    }
    
    function Cheating(address user, address avoid, uint value) public payable{
        require(signups_open);
        for (uint i = 0; i < cheating_list.length; i++) {
            if (user == cheating_list[i].user){
                require(avoid == cheating_list[i].avoid, "Você só pode evitar uma pessoa");
                cheating_list[i].value += value;
            }
        }
        cheating_list.push(Cheat(user, value, avoid));
    }
    
    function get_participants() public view returns(address[]){
        return participants_address;
    }
    
    function announce() public {
        require(participants_address.length >= 1);
        require(signups_open);
        signups_open = false;
        shuffle();
        sort();
        uint size = participants_address.length;
        emit Assigned(participants_address[size - 1],participants_address[0]);
        for(uint i = 1; i < size; i++){
            emit Assigned(participants_address[i - 1],participants_address[i]);
        }
    }
    
    function shuffle() public {
        for (uint i = 0;i < participants_address.length; i++){
            address temp = participants_address[i];
            uint j = random();
            participants_address[i] = participants_address[j];
            participants_address[j] = temp;
        }
    }
    
    function get_lower() public view returns (uint){
        uint lower_value = cheating_list[0].value;
        uint lower = 0;
        for (uint i = 0; i < cheating_list.length; i++){
            if (cheating_list[i].value < lower_value){
                lower_value = cheating_list[i].value;
                lower = i;
            }
        }
        return lower;
    }
    
    function sort() public {
        for (uint x = 0; x < cheating_list.length; x++){
            uint lower = get_lower();
            uint size = participants_address.length;
            address temp ;
            uint j;

            for (uint i = 0; i < participants_address.length; i++){
                if (cheating_list[lower].user == participants_address[i]){
                    if (i==0){
                        if (cheating_list[lower].avoid == participants_address[size - 1]){
                        temp = participants_address[size-1];
                        j = size-2;
                        participants_address[size-1] = participants_address[j];
                        participants_address[j] = temp;
                        }
                    }
                    else {
                        if (cheating_list[lower].avoid == participants_address[i - 1]){
                            temp = participants_address[i-1];
                            j = i-2;
                            participants_address[i-1] = participants_address[j];
                            participants_address[j] = temp;
                        }
                    }
                }
            }
            delete cheating_list[lower];
        }
}
    
    function random() private view returns (uint) {
       return uint(uint256(keccak256(block.timestamp, block.difficulty))%participants_address.length);
    }
  
    //allow owner to reopen for any reason
    function reopen() public{
        require(msg.sender == owner);
        delete participants_address;
        signups_open = true;
    }
}