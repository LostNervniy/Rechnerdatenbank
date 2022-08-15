import { Component, OnInit } from '@angular/core';
import {ComputerDataService} from '../../../services/computer-data.service';

@Component({
  selector: 'app-ips',
  templateUrl: './ips.component.html',
  styleUrls: ['./ips.component.css']
})
export class IPSComponent implements OnInit {

  ips = new Array(253);
  freeIps = new Array(0);

  freeIpsSplitted = [];

  constructor(private computerDataService: ComputerDataService) {
  }

  getFreeIps() {
    this.computerDataService.allComputers().subscribe((res: Response) => {
      for (let pc of res['computer']) {
        this.ips[pc.ip] = pc.ip;
      }
      for ( let i = 1; i < 254; i++) {
        //console.log(this.ips[i]);
        if (this.ips[i] === undefined) {
          this.freeIps.push(i);
        }
      }
    });

    this.computerDataService.allComputers().subscribe((res:Response)=>{
      let orig_length = this.freeIps.length;
      let length = this.freeIps.length;
      while ((length%10)!==0){
        length++;
      }
      length = length/10;
      for(let i = 0; i < length; i++){
        this.freeIpsSplitted.push(new Array(0))
      }

      let index = 0;
      let arrayIndex = 0;
      while(index !== orig_length) {
        this.freeIpsSplitted[arrayIndex].push(this.freeIps[index]);
        index++;
        if((index%10)===0){
          arrayIndex++;
        }
      }

      console.log(this.freeIpsSplitted)
    })
  }

  ngOnInit() {
    this.getFreeIps();
  }

}
