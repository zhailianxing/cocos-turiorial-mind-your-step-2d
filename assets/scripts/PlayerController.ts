import { _decorator, Component, EventMouse, input, Input, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export const BLOCK_SIZE = 40;

@ccclass('PlayerController')
export class PlayerController extends Component {

    private _startJump: boolean = false;
    private _jumpStep: number = 0;
    private _curJumpTime: number = 0;
    private _jumpTime: number = 0.1;  // zhai: 每次跳跃的持续时间是 0.1 秒
    private _curJumpSpeed: number = 0;
    private _curPos: Vec3 = new Vec3();
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    private _targetPos: Vec3 = new Vec3();

    start() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);

    }

    // zhai: update 方法会被引擎以一定的时间间隔调用，比如帧率为 30 每秒时，则每秒会调用 update 30 次，这个方法的作用是为了能够通过特定的时间间隔来尽量模拟现实中时间连续的现象。
    // zhai: 因为 帧率为 30 每秒，所以deltaTime= 1/30= 0.033秒
    update (deltaTime: number) {
        if (this._startJump) {
            this._curJumpTime += deltaTime; // 累计总的跳跃时间
            if (this._curJumpTime > this._jumpTime) { // 当跳跃时间是否结束
                // end 
                this.node.setPosition(this._targetPos); // 强制位置到终点
                this._startJump = false;               // 清理跳跃标记
            } else {
                // zhai: 计算这次画面刷新时，物体应该所处的位置.
                // zhai: 其实就是不停的调用update，不停的更新物体的位置.
                this.node.getPosition(this._curPos); 
                this._deltaPos.x = this._curJumpSpeed * deltaTime; //每一帧根据速度和时间计算位移
                Vec3.add(this._curPos, this._curPos, this._deltaPos); // 应用这个位移
                this.node.setPosition(this._curPos); // 将位移设置给角色
            }
        }
    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            this.jumpByStep(1);
        } else if (event.getButton() === 2) {
            this.jumpByStep(2);
        }
    }

    jumpByStep(step: number) {
        if (this._startJump) {
            return;
        }
        this._startJump = true;  // 标记开始跳跃
        this._jumpStep = step; // 跳跃的步数 1 或者 2
        this._curJumpTime = 0; // 重置开始跳跃的时间
        // zhai: 其实就是 总的跳的长度 除以 总的跳跃时间(目前写死0.1秒)
        this._curJumpSpeed = this._jumpStep * BLOCK_SIZE / this._jumpTime; // 根据时间计算出速度
        this.node.getPosition(this._curPos); // 获取角色当前的位置
        // zhai: 计算目标的最终位置目的： 运行时间一旦超过 设置的总的时间，直接将物体的位置设置到这个targetPos处
        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep * BLOCK_SIZE, 0, 0));    // 计算出目标位置
    }
}


